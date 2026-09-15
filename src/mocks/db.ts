import customersData from "./data/customers.json";
import devicesData from "./data/devices.json";
import invoicesData from "./data/invoices.json";
import notificationsData from "./data/notifications.json";
import partsData from "./data/parts.json";
import paymentsData from "./data/payments.json";
import serviceCatalogData from "./data/serviceCatalog.json";
import serviceOrdersData from "./data/serviceOrders.json";
import shopSettingsData from "./data/shopSettings.json";
import staffData from "./data/staff.json";
import suppliersData from "./data/suppliers.json";
import techniciansData from "./data/technicians.json";

import type {
  AppNotification,
  Customer,
  Device,
  Invoice,
  Payment,
  ServiceCatalogItem,
  ServiceOrder,
  ShopSettings,
  SparePart,
  StaffUser,
  Supplier,
  Technician,
} from "@/types";

// Persisted to localStorage — the one exception to reset-on-reload.
const SHOP_SETTINGS_STORAGE_KEY = "gadgetfix-shop-settings";

function loadShopSettings(): ShopSettings {
  try {
    const saved = localStorage.getItem(SHOP_SETTINGS_STORAGE_KEY);
    if (saved) return JSON.parse(saved) as ShopSettings;
  } catch {
    // Fall back to seed data if storage is unavailable or corrupted.
  }
  return shopSettingsData as unknown as ShopSettings;
}

// The one sanctioned `as` boundary — JSON fixtures aren't type-checked against string-literal unions.
export const db = {
  customers: customersData as unknown as Customer[],
  devices: devicesData as unknown as Device[],
  technicians: techniciansData as unknown as Technician[],
  serviceOrders: serviceOrdersData as unknown as ServiceOrder[],
  parts: partsData as unknown as SparePart[],
  suppliers: suppliersData as unknown as Supplier[],
  invoices: invoicesData as unknown as Invoice[],
  payments: paymentsData as unknown as Payment[],
  staff: staffData as unknown as StaffUser[],
  notifications: notificationsData as unknown as AppNotification[],
  serviceCatalog: serviceCatalogData as unknown as ServiceCatalogItem[],
  shopSettings: loadShopSettings(),
};

/** Updates the shop profile and persists it so it survives a reload. */
export function saveShopSettings(settings: ShopSettings): void {
  db.shopSettings = settings;
  try {
    localStorage.setItem(SHOP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export const MOCK_NOW = new Date("2026-09-12T12:00:00Z");

let idCounter = 100;
/** Generates a demo-friendly sequential id, e.g. genId("SO") -> "SO-1100". */
export function genId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
