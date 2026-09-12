import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { APPROVAL_METHODS, CANCEL_REASONS } from "@/features/orders/constants";
import { useRecordApproval } from "@/features/orders/hooks";
import { approvalSchema, type ApprovalValues } from "@/features/orders/schema";
import { formatCurrency } from "@/lib/utils";
import type { ServiceOrder } from "@/types";

export function ApprovalModal({
  order,
  open,
  onOpenChange,
}: {
  order: ServiceOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useRecordApproval(order.id);
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApprovalValues>({ resolver: zodResolver(approvalSchema), defaultValues: { decision: "approved" } });
  const decision = watch("decision");

  async function onSubmit(values: ApprovalValues) {
    await mutation.mutateAsync({
      approved: values.decision === "approved",
      method: values.method,
      declineReason: values.declineReason,
      note: values.note,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Customer Decision</DialogTitle>
          <DialogDescription>Capture whether the customer approved the repair estimate.</DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
          <div className="flex justify-between font-medium text-foreground">
            <span>Estimate Total</span>
            <span>{formatCurrency(order.estimatedCost ?? 0)}</span>
          </div>
          {order.diagnosisNotes && <p className="mt-1.5 text-xs text-muted-foreground">{order.diagnosisNotes}</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Controller
            control={control}
            name="decision"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-3">
                <Label className="flex cursor-pointer items-center gap-2 rounded-md border border-input p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="approved" /> Approved
                </Label>
                <Label className="flex cursor-pointer items-center gap-2 rounded-md border border-input p-3 has-[:checked]:border-destructive has-[:checked]:bg-destructive/5">
                  <RadioGroupItem value="declined" /> Declined
                </Label>
              </RadioGroup>
            )}
          />

          {decision === "approved" ? (
            <>
              <div className="space-y-1.5">
                <Label>Approval Method</Label>
                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="How did the customer approve?" />
                      </SelectTrigger>
                      <SelectContent>
                        {APPROVAL_METHODS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.method && <p className="text-xs text-destructive">{errors.method.message}</p>}
              </div>
              <div className="flex items-start gap-2">
                <Controller
                  control={control}
                  name="attested"
                  render={({ field }) => (
                    <Checkbox id="attested" checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                  )}
                />
                <Label htmlFor="attested" className="text-sm font-normal leading-snug">
                  I confirm the customer approved this estimate.
                </Label>
              </div>
              {errors.attested && <p className="text-xs text-destructive">{errors.attested.message}</p>}
            </>
          ) : (
            <div className="space-y-1.5">
              <Label>Decline Reason</Label>
              <Controller
                control={control}
                name="declineReason"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Why did the customer decline?" />
                    </SelectTrigger>
                    <SelectContent>
                      {CANCEL_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.declineReason && <p className="text-xs text-destructive">{errors.declineReason.message}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" rows={2} {...register("note")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant={decision === "declined" ? "destructive" : "default"} disabled={mutation.isPending}>
              {decision === "declined" ? "Confirm Decline & Cancel Order" : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
