import { useAuthStore } from "@/features/auth/store";
import { db, genId } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { Role, StaffUser, Technician } from "@/types";

export interface StaffFilters {
  search?: string;
  role?: Role | "all";
  status?: StaffUser["status"] | "all";
}

export interface StaffRow {
  user: StaffUser;
  technician?: Technician;
}

function findStaffUser(id: string): StaffUser {
  const user = db.staff.find((u) => u.id === id);
  if (!user) throw new MockApiError(`Staff account ${id} was not found.`);
  return user;
}

function enrichStaffUser(user: StaffUser): StaffRow {
  const technician = user.linkedTechnicianId
    ? db.technicians.find((t) => t.id === user.linkedTechnicianId)
    : undefined;
  return { user, technician };
}

export async function getStaffRows(filters?: StaffFilters): Promise<StaffRow[]> {
  return simulateRequest(() => {
    let list = [...db.staff];

    if (filters?.role && filters.role !== "all") {
      list = list.filter((u) => u.role === filters.role);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((u) => u.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    return list.map(enrichStaffUser).sort((a, b) => a.user.name.localeCompare(b.user.name));
  });
}

export interface StaffDetail {
  user: StaffUser;
  technician?: Technician;
}

export async function getStaffMember(id: string): Promise<StaffDetail> {
  return simulateRequest(() => enrichStaffUser(findStaffUser(id)));
}

export interface StaffFormInput {
  name: string;
  email: string;
  role: Role;
  linkedTechnicianId?: string;
}

export async function createStaffUser(input: StaffFormInput): Promise<StaffUser> {
  return simulateRequest(() => {
    const user: StaffUser = {
      id: genId("USR"),
      name: input.name,
      email: input.email,
      role: input.role,
      linkedTechnicianId: input.linkedTechnicianId,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    db.staff.unshift(user);
    return user;
  });
}

export async function updateStaffUser(id: string, input: StaffFormInput): Promise<StaffUser> {
  return simulateRequest(() => {
    const user = findStaffUser(id);
    user.name = input.name;
    user.email = input.email;
    user.role = input.role;
    user.linkedTechnicianId = input.linkedTechnicianId;
    return user;
  });
}

export async function setStaffStatus(id: string, status: StaffUser["status"]): Promise<StaffUser> {
  return simulateRequest(() => {
    const currentUserId = useAuthStore.getState().user?.id;
    if (id === currentUserId && status !== "active") {
      throw new MockApiError("You can't deactivate or suspend your own account.");
    }
    const user = findStaffUser(id);
    user.status = status;
    return user;
  });
}
