import { db, genId } from "@/mocks/db";
import { simulateRequest } from "@/mocks/server";
import type { Customer } from "@/types";

// Minimal customer API — enough to power the Service Order wizard's
// "search or add a customer" step. The full Customers module (list/detail/
// edit) is a separate development pass; this stays intentionally small.

export async function getCustomers(): Promise<Customer[]> {
  return simulateRequest(() => [...db.customers].sort((a, b) => a.name.localeCompare(b.name)));
}

export interface CreateCustomerInput {
  name: string;
  phone: string;
  email?: string;
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  return simulateRequest(() => {
    const customer: Customer = {
      id: genId("CUST"),
      name: input.name,
      phone: input.phone,
      email: input.email || undefined,
      type: "walk_in",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    db.customers.unshift(customer);
    return customer;
  });
}
