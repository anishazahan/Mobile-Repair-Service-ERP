import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitDiagnosis } from "@/features/orders/hooks";
import { diagnosisSchema, type DiagnosisValues } from "@/features/orders/schema";

interface DiagnosisModalProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdditionalIssue?: boolean;
}

export function DiagnosisModal({ orderId, open, onOpenChange, isAdditionalIssue }: DiagnosisModalProps) {
  const mutation = useSubmitDiagnosis(orderId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DiagnosisValues>({ resolver: zodResolver(diagnosisSchema), defaultValues: { laborCost: 0 } });

  async function onSubmit(values: DiagnosisValues) {
    await mutation.mutateAsync({ ...values, isAdditionalIssue });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isAdditionalIssue ? "Report Additional Issue" : "Submit Diagnosis"}</DialogTitle>
          <DialogDescription>
            {isAdditionalIssue
              ? "Describe the newly discovered issue — this will re-open customer approval for the added cost."
              : "This unlocks parts selection and sends the order for customer approval."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="diagnosisNotes">Diagnosis / Root Cause</Label>
            <Textarea id="diagnosisNotes" rows={4} placeholder="e.g. Screen digitizer cracked, backlight failing." {...register("diagnosisNotes")} />
            {errors.diagnosisNotes && <p className="text-xs text-destructive">{errors.diagnosisNotes.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="laborCost">Labor Cost (৳)</Label>
            <Input id="laborCost" type="number" min={0} step={50} {...register("laborCost", { valueAsNumber: true })} />
            {errors.laborCost && <p className="text-xs text-destructive">{errors.laborCost.message}</p>}
            <p className="text-xs text-muted-foreground">
              Add spare parts from the Parts Used tab first — the final estimate combines labor + parts.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {isAdditionalIssue ? "Send Updated Estimate" : "Submit & Send for Approval"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
