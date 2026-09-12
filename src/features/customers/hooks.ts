import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "./api";
import type { CustomerFilters } from "./api";

const CUSTOMERS_KEY = ["customers"] as const;
const customerKey = (id: string) => ["customers", "detail", id] as const;

export function useCustomerRows(filters?: CustomerFilters) {
  return useQuery({ queryKey: [...CUSTOMERS_KEY, "rows", filters], queryFn: () => api.getCustomerRows(filters) });
}

export function useCustomer(id: string) {
  return useQuery({ queryKey: customerKey(id), queryFn: () => api.getCustomer(id), enabled: Boolean(id) });
}

/**
 * Flat, unfiltered customer list for pickers elsewhere in the app (the
 * Service Order wizard's customer step, the Devices module's owner select).
 * Kept separate from `useCustomerRows` because those consumers just need
 * `{ id, name }`-shaped options, not the enriched list-page stats.
 */
export function useCustomerOptions() {
  return useQuery({ queryKey: [...CUSTOMERS_KEY, "options"], queryFn: api.getCustomers });
}

function invalidateCustomers(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: CUSTOMERS_KEY });
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createCustomer,
    onSuccess: (customer) => {
      invalidateCustomers(queryClient);
      toast.success(`${customer.name} added.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add the customer."),
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.UpdateCustomerInput) => api.updateCustomer(id, input),
    onSuccess: () => {
      invalidateCustomers(queryClient);
      toast.success("Customer details updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the customer."),
  });
}

export function useSetCustomerStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "active" | "archived") => api.setCustomerStatus(id, status),
    onSuccess: (customer) => {
      invalidateCustomers(queryClient);
      toast.success(customer.status === "archived" ? "Customer archived." : "Customer reactivated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the customer."),
  });
}
