import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "./api";
import type { OrderFilters } from "./api";

const ORDERS_KEY = ["orders"] as const;
const orderKey = (id: string) => ["orders", id] as const;

export function useOrders(filters?: OrderFilters) {
  return useQuery({ queryKey: [...ORDERS_KEY, filters], queryFn: () => api.getOrders(filters) });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: orderKey(id), queryFn: () => api.getOrder(id), enabled: Boolean(id) });
}

function useOrderMutation<TInput>(
  mutationFn: (input: TInput) => Promise<unknown>,
  successMessage: string,
  extraKeys?: readonly (readonly unknown[])[],
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      // Nearly every status transition can move the assigned technician's
      // job between "active" and "completed" — keep their workload/revenue
      // figures accurate everywhere they're shown (Technicians, Reports).
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      extraKeys?.forEach((key) => queryClient.invalidateQueries({ queryKey: key as unknown[] }));
      toast.success(successMessage);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Something went wrong."),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(`Service order ${order.id} created.`);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not create the order."),
  });
}

export function useStartInspection(id: string) {
  return useOrderMutation(() => api.startInspection(id), "Initial inspection started.");
}

export function useAssignTechnician(id: string) {
  return useOrderMutation(
    ({ technicianId, reason }: { technicianId: string; reason?: string }) => api.assignTechnician(id, technicianId, reason),
    "Technician assigned.",
  );
}

export function useStartDiagnosis(id: string) {
  return useOrderMutation(() => api.startDiagnosis(id), "Diagnosis started.");
}

export function useSubmitDiagnosis(id: string) {
  return useOrderMutation((input: api.SubmitDiagnosisInput) => api.submitDiagnosis(id, input), "Sent for customer approval.");
}

export function useRecordApproval(id: string) {
  return useOrderMutation((input: api.RecordApprovalInput) => api.recordApproval(id, input), "Customer decision recorded.");
}

export function useStartRepair(id: string) {
  return useOrderMutation(() => api.startRepair(id), "Repair started.");
}

export function useAddProgressNote(id: string) {
  return useOrderMutation((note: string) => api.addProgressNote(id, note), "Progress note added.");
}

export function useAddPartsUsed(id: string) {
  // Using parts on an order decrements shared stock — invalidate the Spare
  // Parts module's cache too, so its list/detail stay accurate without a
  // manual refresh (see also src/features/parts/hooks.ts).
  return useOrderMutation((input: api.AddPartsInput) => api.addPartsUsed(id, input), "Parts added to order.", [
    ["parts"],
  ]);
}

export function usePauseForParts(id: string) {
  return useOrderMutation(
    ({ missingPartName, note }: { missingPartName: string; note?: string }) => api.pauseForParts(id, missingPartName, note),
    "Order paused — awaiting parts.",
  );
}

export function useResumeRepair(id: string) {
  return useOrderMutation(() => api.resumeRepair(id), "Repair resumed.");
}

export function useSendForQualityCheck(id: string) {
  return useOrderMutation(() => api.sendForQualityCheck(id), "Sent for quality check.");
}

export function useSubmitQualityCheck(id: string) {
  return useOrderMutation((input: api.QualityCheckInput) => api.submitQualityCheck(id, input), "Quality check recorded.");
}

export function useConfirmDelivery(id: string) {
  return useOrderMutation((input: api.DeliveryInput) => api.confirmDelivery(id, input), "Delivery confirmed.");
}

export function useCloseOrder(id: string) {
  // Closing an order generates its invoice (see api.closeOrder) — keep the
  // Billing module's cache in sync.
  return useOrderMutation(() => api.closeOrder(id), "Order closed.", [["billing"]]);
}

export function useCancelOrder(id: string) {
  return useOrderMutation(
    ({ reason, note }: { reason: string; note?: string }) => api.cancelOrder(id, reason, note),
    "Order cancelled.",
  );
}
