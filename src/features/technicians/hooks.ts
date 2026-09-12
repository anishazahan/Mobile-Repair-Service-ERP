import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "./api";
import type { TechnicianFilters } from "./api";

const TECHNICIANS_KEY = ["technicians"] as const;
const technicianKey = (id: string) => ["technicians", "detail", id] as const;

export function useTechnicianRows(filters?: TechnicianFilters) {
  return useQuery({ queryKey: [...TECHNICIANS_KEY, "rows", filters], queryFn: () => api.getTechnicianRows(filters) });
}

export function useTechnician(id: string) {
  return useQuery({ queryKey: technicianKey(id), queryFn: () => api.getTechnician(id), enabled: Boolean(id) });
}

/** Flat options list for pickers — the Staff & Users form's technician-link select. */
export function useTechnicianOptions() {
  return useQuery({ queryKey: [...TECHNICIANS_KEY, "options"], queryFn: api.getTechnicians });
}

function invalidateTechnicians(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: TECHNICIANS_KEY });
  // Dashboard workload chart and Reports' technician performance both read
  // technician + order-assignment data.
  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  queryClient.invalidateQueries({ queryKey: ["reports"] });
}

export function useCreateTechnician() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createTechnician,
    onSuccess: (technician) => {
      invalidateTechnicians(queryClient);
      toast.success(`${technician.name} added.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not add the technician."),
  });
}

export function useUpdateTechnician(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.TechnicianFormInput) => api.updateTechnician(id, input),
    onSuccess: () => {
      invalidateTechnicians(queryClient);
      toast.success("Technician details updated.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the technician."),
  });
}

export function useSetTechnicianStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "active" | "on_leave" | "inactive") => api.setTechnicianStatus(id, status),
    onSuccess: (technician) => {
      invalidateTechnicians(queryClient);
      toast.success(`${technician.name} marked as ${technician.status.replace("_", " ")}.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not update the technician."),
  });
}
