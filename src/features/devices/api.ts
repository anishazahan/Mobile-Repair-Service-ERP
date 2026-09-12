import { db, genId } from "@/mocks/db";
import { simulateRequest } from "@/mocks/server";
import type { Device } from "@/types";

// Minimal device API — same scope note as features/customers/api.ts.

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
      conditionNotes: input.conditionNotes || undefined,
      createdAt: new Date().toISOString(),
    };
    db.devices.unshift(device);
    return device;
  });
}
