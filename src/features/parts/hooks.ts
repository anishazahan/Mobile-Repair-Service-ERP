import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "./api";
import type { PartFilters } from "./api";

const PARTS_KEY = ["parts"] as const;
const partKey = (id: string) => ["parts", "detail", id] as const;

export function usePartRows(filters?: PartFilters) {
  return useQuery({ queryKey: [...PARTS_KEY, "rows", filters], queryFn: () => api.getPartRows(filters) });
}

export function usePart(id: string) {
  return useQuery({ queryKey: partKey(id), queryFn: () => api.getPart(id), enabled: Boolean(id) });
}

function invalidateParts(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: PARTS_KEY });
  // Low-stock KPIs and alerts on the dashboard read live part stock.
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  // Suppliers list shows a per-supplier part count.
  queryClient.invalidateQueries({ queryKey: ["suppliers"] });
}

export function useCreatePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createPart,
    onSuccess: (part) => {
      invalidateParts(queryClient);
      toast.success(`${part.name} added.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add the part."),
  });
}

export function useUpdatePart(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.PartFormInput) => api.updatePart(id, input),
    onSuccess: () => {
      invalidateParts(queryClient);
      toast.success("Part details updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the part."),
  });
}

export function useRestockPart(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quantity: number) => api.restockPart(id, quantity),
    onSuccess: (part) => {
      invalidateParts(queryClient);
      toast.success(`Stock updated — ${part.quantityInStock} ${part.name} now in stock.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update stock."),
  });
}
