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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddCustomerDevice } from "@/features/customers/hooks";
import { deviceFormSchema, type DeviceFormValues } from "@/features/customers/schema";

const DEVICE_TYPES: { value: DeviceFormValues["type"]; label: string }[] = [
  { value: "phone", label: "Phone" },
  { value: "tablet", label: "Tablet" },
  { value: "smartwatch", label: "Smartwatch" },
  { value: "laptop", label: "Laptop" },
];

export function DeviceFormDialog({
  open,
  onOpenChange,
  customerId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string;
}) {
  const mutation = useAddCustomerDevice(customerId);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: { brand: "", model: "", type: "phone", imei: "", color: "", conditionNotes: "" },
  });

  async function onSubmit(values: DeviceFormValues) {
    await mutation.mutateAsync(values);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Device</DialogTitle>
          <DialogDescription>Register a device belonging to this customer.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="Apple, Samsung..." {...register("brand")} />
              {errors.brand && <p className="text-xs text-destructive">{errors.brand.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input id="model" placeholder="iPhone 13, Galaxy S22..." {...register("model")} />
              {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Device Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEVICE_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="color">Color (optional)</Label>
              <Input id="color" {...register("color")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="imei">IMEI / Serial Number</Label>
            <Input id="imei" {...register("imei")} />
            {errors.imei && <p className="text-xs text-destructive">{errors.imei.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="conditionNotes">Condition Notes (optional)</Label>
            <Textarea id="conditionNotes" rows={2} {...register("conditionNotes")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              Add Device
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
