// In-memory mock database — hydrated once from the centralized JSON fixtures
// and mutated in place as the app creates/updates records. This is the
// single source of truth every feature's api.ts reads from; nothing in the
// app should import the raw JSON files directly.

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

// Cast through unknown: the JSON fixtures are hand-authored to match these
// shapes, but TS can't verify string-literal unions (status, category, etc.)
// against plain JSON. This is the one sanctioned `as` boundary in the app.
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
  shopSettings: shopSettingsData as unknown as ShopSettings,
};

// Frozen "current time" for the mock dataset. The seed data is authored as
// if today is Sep 12, 2026 — every "today"/"this month" calculation in the
// app should be based on this constant rather than the real wall clock, so
// the demo stays coherent no matter when it's actually opened.
export const MOCK_NOW = new Date("2026-09-12T12:00:00Z");

let idCounter = 100;
/** Generates a demo-friendly sequential id, e.g. genId("SO") -> "SO-1100". */
export function genId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
