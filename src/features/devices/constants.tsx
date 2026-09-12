import { Laptop, Smartphone, Tablet, Watch, type LucideIcon } from "lucide-react";
import type { DeviceType } from "@/types";

export const DEVICE_TYPE_ICON: Record<DeviceType, LucideIcon> = {
  phone: Smartphone,
  tablet: Tablet,
  smartwatch: Watch,
  laptop: Laptop,
};

export const DEVICE_TYPE_LABEL: Record<DeviceType, string> = {
  phone: "Phone",
  tablet: "Tablet",
  smartwatch: "Smartwatch",
  laptop: "Laptop",
};
