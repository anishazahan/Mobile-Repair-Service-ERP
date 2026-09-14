import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "./api";
import type { DeviceFilters } from "./api";

const DEVICES_KEY = ["devices"] as const;
const deviceKey = (id: string) => ["devices", "detail", id] as const;

export function useDeviceRows(filters?: DeviceFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...DEVICES_KEY, "rows", filters],
    queryFn: () => api.getDeviceRows(filters),
    enabled: options?.enabled ?? true,
  });
}

export function useDevice(id: string) {
  return useQuery({ queryKey: deviceKey(id), queryFn: () => api.getDevice(id), enabled: Boolean(id) });
}

function invalidateDevices(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: DEVICES_KEY });
  // A device always belongs to a customer, and the customer detail page
  // shows its own device list + counts — keep both modules in sync.
  queryClient.invalidateQueries({ queryKey: ["customers"] });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createDevice,
    onSuccess: () => {
      invalidateDevices(queryClient);
      toast.success("Device added.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add the device."),
  });
}

export function useUpdateDevice(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpdateDeviceInput) => api.updateDevice(id, input),
    onSuccess: () => {
      invalidateDevices(queryClient);
      toast.success("Device details updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the device."),
  });
}
