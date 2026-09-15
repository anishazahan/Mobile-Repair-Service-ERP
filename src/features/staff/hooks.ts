import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { StaffFilters } from "./api";
import * as api from "./api";

const STAFF_KEY = ["staff"] as const;
const staffKey = (id: string) => ["staff", "detail", id] as const;

export function useStaffRows(filters?: StaffFilters) {
  return useQuery({
    queryKey: [...STAFF_KEY, "rows", filters],
    queryFn: () => api.getStaffRows(filters),
  });
}

export function useStaffMember(id: string) {
  return useQuery({
    queryKey: staffKey(id),
    queryFn: () => api.getStaffMember(id),
    enabled: Boolean(id),
  });
}

function invalidateStaff(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: STAFF_KEY });

  queryClient.invalidateQueries({ queryKey: ["technicians"] });
}

export function useCreateStaffUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createStaffUser,
    onSuccess: (user) => {
      invalidateStaff(queryClient);
      toast.success(`${user.name} added.`);
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Could not add the staff account.",
      ),
  });
}

export function useUpdateStaffUser(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.StaffFormInput) => api.updateStaffUser(id, input),
    onSuccess: () => {
      invalidateStaff(queryClient);
      toast.success("Staff account updated.");
    },
    onError: (err) =>
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not update the staff account.",
      ),
  });
}

export function useSetStaffStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "active" | "inactive" | "suspended") =>
      api.setStaffStatus(id, status),
    onSuccess: (user) => {
      invalidateStaff(queryClient);
      toast.success(`${user.name} marked as ${user.status}.`);
    },
    onError: (err) =>
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not update the staff account.",
      ),
  });
}
