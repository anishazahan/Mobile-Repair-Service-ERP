import { db, genId, saveShopSettings } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type { ServiceCatalogItem, ShopSettings, StaffUser } from "@/types";

export async function getShopSettings(): Promise<ShopSettings> {
  return simulateRequest(() => db.shopSettings);
}

export async function updateShopSettings(input: ShopSettings): Promise<ShopSettings> {
  return simulateRequest(() => {
    saveShopSettings({ ...input });
    return db.shopSettings;
  });
}

export interface ServiceCatalogFilters {
  search?: string;
  status?: ServiceCatalogItem["status"] | "all";
}

function findServiceCatalogItem(id: string): ServiceCatalogItem {
  const item = db.serviceCatalog.find((s) => s.id === id);
  if (!item) throw new MockApiError(`Service ${id} was not found.`);
  return item;
}

export async function getServiceCatalogRows(filters?: ServiceCatalogFilters): Promise<ServiceCatalogItem[]> {
  return simulateRequest(() => {
    let list = [...db.serviceCatalog];

    if (filters?.status && filters.status !== "all") {
      list = list.filter((s) => s.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }

    return list.sort((a, b) => a.name.localeCompare(b.name));
  });
}

export interface ServiceCatalogFormInput {
  name: string;
  category: string;
  basePrice: number;
  estDurationMinutes: number;
  description?: string;
}

export async function createServiceCatalogItem(input: ServiceCatalogFormInput): Promise<ServiceCatalogItem> {
  return simulateRequest(() => {
    const item: ServiceCatalogItem = { id: genId("SVC"), status: "active", ...input };
    db.serviceCatalog.unshift(item);
    return item;
  });
}

export async function updateServiceCatalogItem(
  id: string,
  input: ServiceCatalogFormInput,
): Promise<ServiceCatalogItem> {
  return simulateRequest(() => {
    const item = findServiceCatalogItem(id);
    item.name = input.name;
    item.category = input.category;
    item.basePrice = input.basePrice;
    item.estDurationMinutes = input.estDurationMinutes;
    item.description = input.description || undefined;
    return item;
  });
}

export async function setServiceCatalogItemStatus(
  id: string,
  status: ServiceCatalogItem["status"],
): Promise<ServiceCatalogItem> {
  return simulateRequest(() => {
    const item = findServiceCatalogItem(id);
    item.status = status;
    return item;
  });
}

export interface MyProfileInput {
  name: string;
  email: string;
}

export async function updateMyProfile(id: string, input: MyProfileInput): Promise<StaffUser> {
  return simulateRequest(() => {
    const user = db.staff.find((u) => u.id === id);
    if (!user) throw new MockApiError("Your staff account could not be found.");
    user.name = input.name;
    user.email = input.email;
    return user;
  });
}
