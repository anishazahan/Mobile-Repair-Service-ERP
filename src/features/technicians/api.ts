import { db, genId } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { ServiceOrder, StaffUser, Technician, TechnicianSpecialty } from "@/types";

const TERMINAL_STATUSES = ["CLOSED", "CANCELLED"];
const COMPLETED_STATUSES = ["DELIVERED", "CLOSED"];

// Flat, unfiltered list for pickers elsewhere — the Staff & Users form's
// "link to a technician profile" select.
export async function getTechnicians(): Promise<Technician[]> {
  return simulateRequest(() => [...db.technicians].sort((a, b) => a.name.localeCompare(b.name)));
}

export interface TechnicianFilters {
  search?: string;
  status?: Technician["status"] | "all";
  specialty?: TechnicianSpecialty | "all";
}

export interface TechnicianRow {
  technician: Technician;
  activeJobs: number;
  completedJobs: number;
  revenueGenerated: number;
}

function findTechnician(id: string): Technician {
  const technician = db.technicians.find((t) => t.id === id);
  if (!technician) throw new MockApiError(`Technician ${id} was not found.`);
  return technician;
}

function technicianStats(technicianId: string) {
  const orders = db.serviceOrders.filter((o) => o.assignedTechnicianId === technicianId);
  const activeJobs = orders.filter((o) => !TERMINAL_STATUSES.includes(o.status)).length;
  const completedOrders = orders.filter((o) => COMPLETED_STATUSES.includes(o.status));
  const revenueGenerated = completedOrders.reduce((sum, o) => sum + (o.finalCost ?? 0), 0);
  return { activeJobs, completedJobs: completedOrders.length, revenueGenerated };
}

function enrichTechnician(technician: Technician): TechnicianRow {
  return { technician, ...technicianStats(technician.id) };
}

export async function getTechnicianRows(filters?: TechnicianFilters): Promise<TechnicianRow[]> {
  return simulateRequest(() => {
    let list = [...db.technicians];

    if (filters?.status && filters.status !== "all") {
      list = list.filter((t) => t.status === filters.status);
    }
    if (filters?.specialty && filters.specialty !== "all") {
      list = list.filter((t) => t.specialties.includes(filters.specialty as TechnicianSpecialty));
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((t) => t.name.toLowerCase().includes(q) || t.phone.toLowerCase().includes(q));
    }

    return list.map(enrichTechnician).sort((a, b) => a.technician.name.localeCompare(b.technician.name));
  });
}

export interface TechnicianOrderRow {
  order: ServiceOrder;
  customerName?: string;
  deviceLabel?: string;
}

export interface TechnicianDetail {
  technician: Technician;
  orders: TechnicianOrderRow[];
  activeJobs: number;
  completedJobs: number;
  revenueGenerated: number;
  linkedStaffUser?: StaffUser;
}

export async function getTechnician(id: string): Promise<TechnicianDetail> {
  return simulateRequest(() => {
    const technician = findTechnician(id);
    const orders = db.serviceOrders
      .filter((o) => o.assignedTechnicianId === id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((order) => {
        const customer = db.customers.find((c) => c.id === order.customerId);
        const device = db.devices.find((d) => d.id === order.deviceId);
        return {
          order,
          customerName: customer?.name,
          deviceLabel: device ? `${device.brand} ${device.model}` : undefined,
        };
      });
    const linkedStaffUser = db.staff.find((u) => u.linkedTechnicianId === id);
    return { technician, orders, ...technicianStats(id), linkedStaffUser };
  });
}

export interface TechnicianFormInput {
  name: string;
  phone: string;
  email?: string;
  specialties: TechnicianSpecialty[];
}

export async function createTechnician(input: TechnicianFormInput): Promise<Technician> {
  return simulateRequest(() => {
    const technician: Technician = {
      id: genId("TECH"),
      name: input.name,
      phone: input.phone,
      email: input.email || undefined,
      specialties: input.specialties,
      status: "active",
      joinedAt: new Date().toISOString(),
    };
    db.technicians.unshift(technician);
    return technician;
  });
}

export async function updateTechnician(id: string, input: TechnicianFormInput): Promise<Technician> {
  return simulateRequest(() => {
    const technician = findTechnician(id);
    technician.name = input.name;
    technician.phone = input.phone;
    technician.email = input.email || undefined;
    technician.specialties = input.specialties;
    return technician;
  });
}

export async function setTechnicianStatus(id: string, status: Technician["status"]): Promise<Technician> {
  return simulateRequest(() => {
    const technician = findTechnician(id);
    technician.status = status;
    return technician;
  });
}
