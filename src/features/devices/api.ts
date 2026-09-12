import { db, genId } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { Customer, Device, ServiceOrder } from "@/types";

export async function getDevicesByCustomer(customerId: string): Promise<Device[]> {
  return simulateRequest(() => db.devices.filter((d) => d.customerId === customerId));
}

export interface CreateDeviceInput {
  customerId: string;
  brand: string;
  model: string;
  imei: string;
  color?: string;
  type?: Device["type"];
  purchaseDate?: string;
  conditionNotes?: string;
}

export async function createDevice(input: CreateDeviceInput): Promise<Device> {
  return simulateRequest(() => {
    const device: Device = {
      id: genId("DEV"),
      customerId: input.customerId,
      brand: input.brand,
      model: input.model,
      type: input.type ?? "phone",
      imei: input.imei,
      color: input.color || undefined,
      purchaseDate: input.purchaseDate || undefined,
      conditionNotes: input.conditionNotes || undefined,
      createdAt: new Date().toISOString(),
    };
    db.devices.unshift(device);
    return device;
  });
}

// --- Full Devices module: cross-customer list, detail, edit ---

export interface DeviceFilters {
  search?: string;
  type?: Device["type"] | "all";
}

export interface DeviceRow {
  device: Device;
  customer?: Customer;
  orderCount: number;
  lastServiceAt?: string;
}

function findDevice(id: string): Device {
  const device = db.devices.find((d) => d.id === id);
  if (!device) throw new MockApiError(`Device ${id} was not found.`);
  return device;
}

function enrichDevice(device: Device): DeviceRow {
  const customer = db.customers.find((c) => c.id === device.customerId);
  const orders = db.serviceOrders.filter((o) => o.deviceId === device.id);
  const lastServiceAt = orders.reduce<string | undefined>(
    (latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest),
    undefined,
  );
  return { device, customer, orderCount: orders.length, lastServiceAt };
}

export async function getDeviceRows(filters?: DeviceFilters): Promise<DeviceRow[]> {
  return simulateRequest(() => {
    let list = [...db.devices];

    if (filters?.type && filters.type !== "all") {
      list = list.filter((d) => d.type === filters.type);
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((d) => {
        const customer = db.customers.find((c) => c.id === d.customerId);
        return (
          d.brand.toLowerCase().includes(q) ||
          d.model.toLowerCase().includes(q) ||
          d.imei.toLowerCase().includes(q) ||
          customer?.name.toLowerCase().includes(q)
        );
      });
    }

    return list.map(enrichDevice).sort((a, b) => (a.device.createdAt < b.device.createdAt ? 1 : -1));
  });
}

export interface DeviceOrderRow {
  order: ServiceOrder;
}

export interface DeviceDetail {
  device: Device;
  customer?: Customer;
  orders: DeviceOrderRow[];
}

export async function getDevice(id: string): Promise<DeviceDetail> {
  return simulateRequest(() => {
    const device = findDevice(id);
    const customer = db.customers.find((c) => c.id === device.customerId);
    const orders = db.serviceOrders
      .filter((o) => o.deviceId === id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((order) => ({ order }));
    return { device, customer, orders };
  });
}

export interface UpdateDeviceInput {
  brand: string;
  model: string;
  type: Device["type"];
  imei: string;
  color?: string;
  purchaseDate?: string;
  conditionNotes?: string;
}

export async function updateDevice(id: string, input: UpdateDeviceInput): Promise<Device> {
  return simulateRequest(() => {
    const device = findDevice(id);
    device.brand = input.brand;
    device.model = input.model;
    device.type = input.type;
    device.imei = input.imei;
    device.color = input.color || undefined;
    device.purchaseDate = input.purchaseDate || undefined;
    device.conditionNotes = input.conditionNotes || undefined;
    return device;
  });
}
