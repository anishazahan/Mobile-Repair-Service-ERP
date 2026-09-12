import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "./api";
import type { SupplierFilters } from "./api";

const SUPPLIERS_KEY = ["suppliers"] as const;
const supplierKey = (id: string) => ["suppliers", "detail", id] as const;

export function useSupplierRows(filters?: SupplierFilters) {
  return useQuery({ queryKey: [...SUPPLIERS_KEY, "rows", filters], queryFn: () => api.getSupplierRows(filters) });
}

export function useSupplier(id: string) {
  return useQuery({ queryKey: supplierKey(id), queryFn: () => api.getSupplier(id), enabled: Boolean(id) });
}

/** Flat options list for pickers — the Spare Parts form's supplier select. */
export function useSupplierOptions() {
  return useQuery({ queryKey: [...SUPPLIERS_KEY, "options"], queryFn: api.getSuppliers });
}

function invalidateSuppliers(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: SUPPLIERS_KEY });
  // Spare Parts rows show each part's supplier — keep that view accurate too.
  queryClient.invalidateQueries({ queryKey: ["parts"] });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createSupplier,
    onSuccess: (supplier) => {
      invalidateSuppliers(queryClient);
      toast.success(`${supplier.name} added.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add the supplier."),
  });
}

export function useUpdateSupplier(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.SupplierFormInput) => api.updateSupplier(id, input),
    onSuccess: () => {
      invalidateSuppliers(queryClient);
      toast.success("Supplier details updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the supplier."),
  });
}

export function useSetSupplierStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "active" | "inactive") => api.setSupplierStatus(id, status),
    onSuccess: (supplier) => {
      invalidateSuppliers(queryClient);
      toast.success(supplier.status === "inactive" ? "Supplier marked inactive." : "Supplier reactivated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the supplier."),
  });
}
