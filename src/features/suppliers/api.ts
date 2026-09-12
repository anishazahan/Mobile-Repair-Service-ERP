import { db, genId } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { SparePart, Supplier } from "@/types";

// Flat, unfiltered list for pickers elsewhere (the Spare Parts form's
// supplier select) — mirrors the getCustomers()/getCustomerOptions() pattern.
export async function getSuppliers(): Promise<Supplier[]> {
  return simulateRequest(() => [...db.suppliers].sort((a, b) => a.name.localeCompare(b.name)));
}

export interface SupplierFilters {
  search?: string;
  status?: Supplier["status"] | "all";
}

export interface SupplierRow {
  supplier: Supplier;
  partCount: number;
}

function findSupplier(id: string): Supplier {
  const supplier = db.suppliers.find((s) => s.id === id);
  if (!supplier) throw new MockApiError(`Supplier ${id} was not found.`);
  return supplier;
}

function enrichSupplier(supplier: Supplier): SupplierRow {
  return { supplier, partCount: db.parts.filter((p) => p.supplierId === supplier.id).length };
}

export async function getSupplierRows(filters?: SupplierFilters): Promise<SupplierRow[]> {
  return simulateRequest(() => {
    let list = [...db.suppliers];

    if (filters?.status && filters.status !== "all") {
      list = list.filter((s) => s.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.contactPerson.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q),
      );
    }

    return list.map(enrichSupplier).sort((a, b) => a.supplier.name.localeCompare(b.supplier.name));
  });
}

export interface SupplierDetail {
  supplier: Supplier;
  parts: SparePart[];
  stockValue: number;
}

export async function getSupplier(id: string): Promise<SupplierDetail> {
  return simulateRequest(() => {
    const supplier = findSupplier(id);
    const parts = db.parts.filter((p) => p.supplierId === id);
    const stockValue = parts.reduce((sum, p) => sum + p.quantityInStock * p.unitCost, 0);
    return { supplier, parts, stockValue };
  });
}

export interface SupplierFormInput {
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
}

export async function createSupplier(input: SupplierFormInput): Promise<Supplier> {
  return simulateRequest(() => {
    const supplier: Supplier = {
      id: genId("SUP"),
      name: input.name,
      contactPerson: input.contactPerson,
      phone: input.phone,
      email: input.email || undefined,
      address: input.address || undefined,
      status: "active",
    };
    db.suppliers.unshift(supplier);
    return supplier;
  });
}

export async function updateSupplier(id: string, input: SupplierFormInput): Promise<Supplier> {
  return simulateRequest(() => {
    const supplier = findSupplier(id);
    supplier.name = input.name;
    supplier.contactPerson = input.contactPerson;
    supplier.phone = input.phone;
    supplier.email = input.email || undefined;
    supplier.address = input.address || undefined;
    return supplier;
  });
}

export async function setSupplierStatus(id: string, status: Supplier["status"]): Promise<Supplier> {
  return simulateRequest(() => {
    const supplier = findSupplier(id);
    supplier.status = status;
    return supplier;
  });
}
