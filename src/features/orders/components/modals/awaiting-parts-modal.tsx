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
import { usePauseForParts } from "@/features/orders/hooks";
import { awaitingPartsSchema, type AwaitingPartsValues } from "@/features/orders/schema";

export function AwaitingPartsModal({
  orderId,
  open,
  onOpenChange,
}: {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = usePauseForParts(orderId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AwaitingPartsValues>({ resolver: zodResolver(awaitingPartsSchema) });

  async function onSubmit(values: AwaitingPartsValues) {
    await mutation.mutateAsync(values);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pause — Awaiting Parts</DialogTitle>
          <DialogDescription>The repair will move to "Awaiting Parts" until you resume it.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="missingPartName">Missing Part</Label>
            <Input id="missingPartName" placeholder="e.g. iPad 9th Gen Digitizer" {...register("missingPartName")} />
            {errors.missingPartName && <p className="text-xs text-destructive">{errors.missingPartName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" rows={2} placeholder="Expected availability, supplier, etc." {...register("note")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              Pause Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
