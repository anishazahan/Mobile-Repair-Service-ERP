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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ACCESSORY_OPTIONS, DELIVERY_METHODS } from "@/features/orders/constants";
import { useConfirmDelivery } from "@/features/orders/hooks";
import { deliverySchema, type DeliveryValues } from "@/features/orders/schema";
import type { ServiceOrder } from "@/types";

export function DeliveryModal({
  order,
  open,
  onOpenChange,
}: {
  order: ServiceOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useConfirmDelivery(order.id);
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<DeliveryValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { accessoriesConfirmed: order.accessoriesReceived, conditionOk: true },
  });
  const conditionOk = watch("conditionOk");
  const accessoriesConfirmed = watch("accessoriesConfirmed") ?? [];

  function toggleAccessory(item: string, checked: boolean) {
    return checked
      ? [...accessoriesConfirmed, item]
      : accessoriesConfirmed.filter((a) => a !== item);
  }

  async function onSubmit(values: DeliveryValues) {
    await mutation.mutateAsync(values);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delivery</DialogTitle>
          <DialogDescription>Verify accessories and condition before handing the device back.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label>Accessories Returned</Label>
            <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
              {ACCESSORY_OPTIONS.filter((a) => order.accessoriesReceived.includes(a)).map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name="accessoriesConfirmed"
                    render={({ field }) => (
                      <Checkbox
                        id={`acc-${item}`}
                        checked={field.value?.includes(item)}
                        onCheckedChange={(checked) => field.onChange(toggleAccessory(item, Boolean(checked)))}
                      />
                    )}
                  />
                  <Label htmlFor={`acc-${item}`} className="text-sm font-normal">
                    {item}
                  </Label>
                </div>
              ))}
              {order.accessoriesReceived.length === 0 && (
                <p className="text-xs text-muted-foreground">No accessories were logged at intake.</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Delivery Method</Label>
            <Controller
              control={control}
              name="method"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="How is the device being returned?" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_METHODS.map((m) => (
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

          <div className="space-y-1.5">
            <Label htmlFor="representativeName">Representative Name (if applicable)</Label>
            <Input id="representativeName" {...register("representativeName")} />
          </div>

          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="conditionOk"
              render={({ field }) => <Checkbox id="conditionOk" checked={field.value} onCheckedChange={field.onChange} />}
            />
            <Label htmlFor="conditionOk" className="text-sm font-normal">
              Device condition matches expectations
            </Label>
          </div>
          {!conditionOk && (
            <div className="space-y-1.5">
              <Label htmlFor="conditionNote">Condition Note</Label>
              <Textarea id="conditionNote" rows={2} {...register("conditionNote")} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              Confirm Delivery
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
