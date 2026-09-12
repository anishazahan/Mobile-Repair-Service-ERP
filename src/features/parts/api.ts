import { db, genId } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { PartCategory, ServiceOrder, SparePart, Supplier } from "@/types";

export type StockLevel = "in_stock" | "low" | "out";

export function stockLevel(part: SparePart): StockLevel {
  if (part.quantityInStock === 0) return "out";
  if (part.quantityInStock <= part.reorderLevel) return "low";
  return "in_stock";
}

export interface PartFilters {
  search?: string;
  category?: PartCategory | "all";
  stock?: StockLevel | "all";
}

export interface PartRow {
  part: SparePart;
  supplier?: Supplier;
}

function findPart(id: string): SparePart {
  const part = db.parts.find((p) => p.id === id);
  if (!part) throw new MockApiError(`Spare part ${id} was not found.`);
  return part;
}

function enrichPart(part: SparePart): PartRow {
  const supplier = part.supplierId ? db.suppliers.find((s) => s.id === part.supplierId) : undefined;
  return { part, supplier };
}

export async function getPartRows(filters?: PartFilters): Promise<PartRow[]> {
  return simulateRequest(() => {
    let list = [...db.parts];

    if (filters?.category && filters.category !== "all") {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters?.stock && filters.stock !== "all") {
      list = list.filter((p) => stockLevel(p) === filters.stock);
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.compatibleModels.some((m) => m.toLowerCase().includes(q)),
      );
    }

    return list.map(enrichPart).sort((a, b) => a.part.name.localeCompare(b.part.name));
  });
}

export interface PartUsageRow {
  order: ServiceOrder;
  quantity: number;
  unitPrice: number;
}

export interface PartDetail {
  part: SparePart;
  supplier?: Supplier;
  usage: PartUsageRow[];
}

export async function getPart(id: string): Promise<PartDetail> {
  return simulateRequest(() => {
    const part = findPart(id);
    const supplier = part.supplierId ? db.suppliers.find((s) => s.id === part.supplierId) : undefined;
    const usage = db.serviceOrders
      .filter((o) => o.partsUsed.some((line) => line.partId === id))
      .map((order) => {
        const line = order.partsUsed.find((l) => l.partId === id)!;
        return { order, quantity: line.quantity, unitPrice: line.unitPrice };
      })
      .sort((a, b) => (a.order.createdAt < b.order.createdAt ? 1 : -1));
    return { part, supplier, usage };
  });
}

export interface PartFormInput {
  name: string;
  sku: string;
  category: PartCategory;
  compatibleModels: string[];
  quantityInStock: number;
  reorderLevel: number;
  unitCost: number;
  sellingPrice: number;
  supplierId?: string;
}

export async function createPart(input: PartFormInput): Promise<SparePart> {
  return simulateRequest(() => {
    const part: SparePart = { id: genId("PART"), ...input };
    db.parts.unshift(part);
    return part;
  });
}

export async function updatePart(id: string, input: PartFormInput): Promise<SparePart> {
  return simulateRequest(() => {
    const part = findPart(id);
    part.name = input.name;
    part.sku = input.sku;
    part.category = input.category;
    part.compatibleModels = input.compatibleModels;
    part.quantityInStock = input.quantityInStock;
    part.reorderLevel = input.reorderLevel;
    part.unitCost = input.unitCost;
    part.sellingPrice = input.sellingPrice;
    part.supplierId = input.supplierId;
    return part;
  });
}

export async function restockPart(id: string, quantity: number): Promise<SparePart> {
  return simulateRequest(() => {
    const part = findPart(id);
    part.quantityInStock += quantity;
    return part;
  });
}
