import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { useRestockPart } from "@/features/parts/hooks";
import { restockSchema, type RestockValues } from "@/features/parts/schema";
import type { SparePart } from "@/types";

export function RestockDialog({
  open,
  onOpenChange,
  part,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: SparePart;
}) {
  const mutation = useRestockPart(part.id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestockValues>({ resolver: zodResolver(restockSchema), defaultValues: { quantity: 1 } });

  useEffect(() => {
    if (open) reset({ quantity: 1 });
  }, [open, reset]);

  async function onSubmit(values: RestockValues) {
    await mutation.mutateAsync(values.quantity);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock {part.name}</DialogTitle>
          <DialogDescription>Currently {part.quantityInStock} in stock. Enter the quantity received.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="quantity">Quantity Received</Label>
            <Input id="quantity" type="number" min={1} {...register("quantity", { valueAsNumber: true })} />
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              Add Stock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
