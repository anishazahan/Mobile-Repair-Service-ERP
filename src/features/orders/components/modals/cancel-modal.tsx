import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CANCEL_REASONS } from "@/features/orders/constants";
import { useCancelOrder } from "@/features/orders/hooks";
import { cancelSchema, type CancelValues } from "@/features/orders/schema";

export function CancelOrderModal({
  orderId,
  open,
  onOpenChange,
}: {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useCancelOrder(orderId);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelValues>({ resolver: zodResolver(cancelSchema) });

  async function onSubmit(values: CancelValues) {
    await mutation.mutateAsync(values);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Service Order</DialogTitle>
          <DialogDescription>This is a terminal action and requires a reason for the record.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label>Cancellation Reason</Label>
            <Controller
              control={control}
              name="reason"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
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
            {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" rows={2} {...register("note")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Keep Order
            </Button>
            <Button type="submit" variant="destructive" disabled={mutation.isPending}>
              Cancel Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
