import {
  LayoutDashboard,
  Smartphone,
  Users,
  Wrench,
  Package,
  Truck,
  Receipt,
  BarChart3,
  UserCog,
  Settings,
} from "lucide-react";
import type { Role } from "@/types";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  roles?: Role[]; // omitted = visible to every role
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ label: "Dashboard", to: "/app", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { label: "Service Orders", to: "/app/orders", icon: Wrench },
      { label: "Customers", to: "/app/customers", icon: Users },
      { label: "Devices", to: "/app/devices", icon: Smartphone },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Spare Parts", to: "/app/inventory/parts", icon: Package },
      { label: "Suppliers", to: "/app/inventory/suppliers", icon: Truck },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Billing", to: "/app/billing", icon: Receipt, roles: ["admin", "manager", "front_desk"] },
      { label: "Reports", to: "/app/reports", icon: BarChart3, roles: ["admin", "manager"] },
    ],
  },
  {
    label: "Team",
    items: [
      { label: "Technicians", to: "/app/technicians", icon: Wrench },
      { label: "Staff & Users", to: "/app/staff", icon: UserCog, roles: ["admin", "manager"] },
    ],
  },
  {
    items: [{ label: "Settings", to: "/app/settings", icon: Settings, roles: ["admin", "manager"] }],
  },
];

export function isNavItemVisible(item: NavItem, role: Role): boolean {
  return !item.roles || item.roles.includes(role);
}
