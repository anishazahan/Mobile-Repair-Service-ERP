import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "./api";
import type { InvoiceFilters } from "./api";

const BILLING_KEY = ["billing"] as const;
const invoiceKey = (id: string) => ["billing", "detail", id] as const;

export function useInvoiceRows(filters?: InvoiceFilters) {
  return useQuery({ queryKey: [...BILLING_KEY, "rows", filters], queryFn: () => api.getInvoiceRows(filters) });
}

export function useInvoice(id: string) {
  return useQuery({ queryKey: invoiceKey(id), queryFn: () => api.getInvoice(id), enabled: Boolean(id) });
}

export function useRecordPayment(invoiceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.RecordPaymentInput) => api.recordPayment(invoiceId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Payment recorded.");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Could not record the payment."),
  });
}
