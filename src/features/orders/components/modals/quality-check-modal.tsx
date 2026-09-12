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
import { Textarea } from "@/components/ui/textarea";
import { useSubmitQualityCheck } from "@/features/orders/hooks";
import { qualityCheckSchema, type QualityCheckValues } from "@/features/orders/schema";

const CHECKS: { key: keyof QualityCheckValues; label: string }[] = [
  { key: "issueResolved", label: "Reported issue is resolved" },
  { key: "functionsNormally", label: "Device powers on and functions normally" },
  { key: "cosmeticOk", label: "Cosmetic condition is acceptable" },
];

export function QualityCheckModal({
  orderId,
  open,
  onOpenChange,
}: {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useSubmitQualityCheck(orderId);
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<QualityCheckValues>({
    resolver: zodResolver(qualityCheckSchema),
    defaultValues: { issueResolved: true, functionsNormally: true, cosmeticOk: true },
  });
  const values = watch();
  const allPass = values.issueResolved && values.functionsNormally && values.cosmeticOk;

  async function onSubmit(formValues: QualityCheckValues) {
    await mutation.mutateAsync({ passed: allPass, notes: formValues.notes ?? "" });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quality Check</DialogTitle>
          <DialogDescription>An independent check before the device is marked ready for pickup.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-3 rounded-md border border-border p-3">
            {CHECKS.map((check) => (
              <div key={check.key} className="flex items-center gap-2.5">
                <Controller
                  control={control}
                  name={check.key}
                  render={({ field }) => (
                    <Checkbox id={check.key} checked={field.value as boolean} onCheckedChange={field.onChange} />
                  )}
                />
                <Label htmlFor={check.key} className="text-sm font-normal">
                  {check.label}
                </Label>
              </div>
            ))}
          </div>

          <div
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              allPass ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            }`}
          >
            {allPass ? "All checks pass — will move to Ready for Pickup." : "One or more checks failed — will send back for rework."}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">QC Notes {!allPass && "(required on fail)"}</Label>
            <Textarea id="notes" rows={3} {...register("notes")} />
            {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {allPass ? "Pass — Ready for Pickup" : "Fail — Send Back for Rework"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
