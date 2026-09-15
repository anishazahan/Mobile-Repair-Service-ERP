import { db, genId } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { Customer, Device, ServiceOrder } from "@/types";

export async function getCustomers(): Promise<Customer[]> {
  return simulateRequest(() =>
    [...db.customers].sort((a, b) => a.name.localeCompare(b.name)),
  );
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  type?: Customer["type"];
  notes?: string;
}

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<Customer> {
  return simulateRequest(() => {
    const customer: Customer = {
      id: genId("CUST"),
      name: input.name,
      phone: input.phone,
      email: input.email || undefined,
      address: input.address || undefined,
      type: input.type ?? "walk_in",
      status: "active",
      notes: input.notes || undefined,
      createdAt: new Date().toISOString(),
    };
    db.customers.unshift(customer);
    return customer;
  });
}

// --- Full Customers module: list, detail, edit, archive ---

export interface CustomerFilters {
  search?: string;
  type?: Customer["type"] | "all";
  status?: Customer["status"] | "all";
}

export interface CustomerRow {
  customer: Customer;
  deviceCount: number;
  orderCount: number;
  openOrderCount: number;
  totalSpent: number;
  lastOrderAt?: string;
}

function customerStats(customerId: string) {
  const orders = db.serviceOrders.filter((o) => o.customerId === customerId);
  const totalSpent = orders.reduce((sum, o) => sum + (o.finalCost ?? 0), 0);
  const openOrderCount = orders.filter(
    (o) => o.status !== "CLOSED" && o.status !== "CANCELLED",
  ).length;
  const lastOrderAt = orders.reduce<string | undefined>(
    (latest, o) => (!latest || o.createdAt > latest ? o.createdAt : latest),
    undefined,
  );
  return { orderCount: orders.length, openOrderCount, totalSpent, lastOrderAt };
}

function enrichCustomer(customer: Customer): CustomerRow {
  const deviceCount = db.devices.filter(
    (d) => d.customerId === customer.id,
  ).length;
  return { customer, deviceCount, ...customerStats(customer.id) };
}

export async function getCustomerRows(
  filters?: CustomerFilters,
): Promise<CustomerRow[]> {
  return simulateRequest(() => {
    let list = [...db.customers];

    if (filters?.type && filters.type !== "all") {
      list = list.filter((c) => c.type === filters.type);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((c) => c.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q),
      );
    }

    return list
      .map(enrichCustomer)
      .sort((a, b) => (a.customer.createdAt < b.customer.createdAt ? 1 : -1));
  });
}

function findCustomer(id: string): Customer {
  const customer = db.customers.find((c) => c.id === id);
  if (!customer) throw new MockApiError(`Customer ${id} was not found.`);
  return customer;
}

export interface CustomerOrderRow {
  order: ServiceOrder;
  device?: Device;
}

export interface CustomerDetail {
  customer: Customer;
  devices: Device[];
  orders: CustomerOrderRow[];
  totalSpent: number;
  openOrderCount: number;
}

export async function getCustomer(id: string): Promise<CustomerDetail> {
  return simulateRequest(() => {
    const customer = findCustomer(id);
    const devices = db.devices.filter((d) => d.customerId === id);
    const orders = db.serviceOrders
      .filter((o) => o.customerId === id)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((order) => ({
        order,
        device: db.devices.find((d) => d.id === order.deviceId),
      }));
    const { totalSpent, openOrderCount } = customerStats(id);
    return { customer, devices, orders, totalSpent, openOrderCount };
  });
}

export interface UpdateCustomerInput {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  type: Customer["type"];
  notes?: string;
}

export async function updateCustomer(
  id: string,
  input: UpdateCustomerInput,
): Promise<Customer> {
  return simulateRequest(() => {
    const customer = findCustomer(id);
    customer.name = input.name;
    customer.phone = input.phone;
    customer.email = input.email || undefined;
    customer.address = input.address || undefined;
    customer.type = input.type;
    customer.notes = input.notes || undefined;
    return customer;
  });
}

export async function setCustomerStatus(
  id: string,
  status: Customer["status"],
): Promise<Customer> {
  return simulateRequest(() => {
    const customer = findCustomer(id);
    customer.status = status;
    return customer;
  });
}
