import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store";
import * as api from "./api";
import type { ServiceCatalogFilters } from "./api";

export function useShopSettings() {
  return useQuery({ queryKey: ["settings", "shop"], queryFn: api.getShopSettings });
}

export function useUpdateShopSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateShopSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", "shop"] });
      toast.success("Shop profile updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update shop settings."),
  });
}

export function useServiceCatalogRows(filters?: ServiceCatalogFilters) {
  return useQuery({
    queryKey: ["settings", "catalog", filters],
    queryFn: () => api.getServiceCatalogRows(filters),
  });
}

function invalidateCatalog(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["settings", "catalog"] });
}

export function useCreateServiceCatalogItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createServiceCatalogItem,
    onSuccess: (item) => {
      invalidateCatalog(queryClient);
      toast.success(`${item.name} added to the catalog.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add the service."),
  });
}

export function useUpdateServiceCatalogItem(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.ServiceCatalogFormInput) => api.updateServiceCatalogItem(id, input),
    onSuccess: () => {
      invalidateCatalog(queryClient);
      toast.success("Service updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the service."),
  });
}

export function useSetServiceCatalogItemStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "active" | "inactive") => api.setServiceCatalogItemStatus(id, status),
    onSuccess: (item) => {
      invalidateCatalog(queryClient);
      toast.success(`${item.name} marked as ${item.status}.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the service."),
  });
}

export function useUpdateMyProfile(id: string) {
  const queryClient = useQueryClient();
  const updateSessionUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: (input: api.MyProfileInput) => api.updateMyProfile(id, input),
    onSuccess: (user) => {
      updateSessionUser(user);
      // The same record backs the Staff & Users list/detail pages.
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Profile updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update your profile."),
  });
}
