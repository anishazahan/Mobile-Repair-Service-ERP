import { useState } from "react";
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
import { useCloseOrder } from "@/features/orders/hooks";
import { formatCurrency } from "@/lib/utils";
import type { ServiceOrder } from "@/types";

export function CloseOrderModal({
  order,
  open,
  onOpenChange,
}: {
  order: ServiceOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [paymentReceived, setPaymentReceived] = useState(false);
  const mutation = useCloseOrder(order.id);
  const total = order.estimatedCost ?? 0;

  async function handleClose() {
    await mutation.mutateAsync(undefined);
    onOpenChange(false);
    setPaymentReceived(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Close Order</DialogTitle>
          <DialogDescription>
            Closing generates the final invoice and archives this order to service history.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
          <div className="flex justify-between font-medium text-foreground">
            <span>Amount Due</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="paymentReceived" checked={paymentReceived} onCheckedChange={(c) => setPaymentReceived(Boolean(c))} />
          <Label htmlFor="paymentReceived" className="text-sm font-normal">
            Payment of {formatCurrency(total)} has been received in full
          </Label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Not Yet
          </Button>
          <Button type="button" disabled={!paymentReceived || mutation.isPending} onClick={handleClose}>
            Close Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
