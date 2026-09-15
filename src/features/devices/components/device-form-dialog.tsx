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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerOptions } from "@/features/customers/hooks";
import { useCreateDevice, useUpdateDevice } from "@/features/devices/hooks";
import {
  deviceFormSchema,
  type DeviceFormValues,
} from "@/features/devices/schema";
import type { Device } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const DEVICE_TYPES: { value: DeviceFormValues["type"]; label: string }[] = [
  { value: "phone", label: "Phone" },
  { value: "tablet", label: "Tablet" },
  { value: "smartwatch", label: "Smartwatch" },
  { value: "laptop", label: "Laptop" },
];

const BLANK: DeviceFormValues = {
  brand: "",
  model: "",
  type: "phone",
  imei: "",
  color: "",
  purchaseDate: "",
  conditionNotes: "",
};

export function DeviceFormDialog({
  open,
  onOpenChange,
  customerId,
  device,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId?: string;
  device?: Device;
  onSaved?: (device: Device) => void;
}) {
  const needsCustomerPicker = !customerId && !device;
  const { data: customers } = useCustomerOptions();
  const [pickedCustomerId, setPickedCustomerId] = useState("");
  const [customerError, setCustomerError] = useState(false);

  const createMutation = useCreateDevice();
  const updateMutation = useUpdateDevice(device?.id ?? "");
  const mutation = device ? updateMutation : createMutation;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: BLANK,
  });

  useEffect(() => {
    if (open) {
      setPickedCustomerId("");
      setCustomerError(false);
      reset(
        device
          ? {
              brand: device.brand,
              model: device.model,
              type: device.type,
              imei: device.imei,
              color: device.color ?? "",
              purchaseDate: device.purchaseDate ?? "",
              conditionNotes: device.conditionNotes ?? "",
            }
          : BLANK,
      );
    }
  }, [open, device, reset]);

  async function onSubmit(values: DeviceFormValues) {
    if (device) {
      const saved = await updateMutation.mutateAsync(values);
      onOpenChange(false);
      onSaved?.(saved);
      return;
    }

    const ownerId = customerId ?? pickedCustomerId;
    if (!ownerId) {
      setCustomerError(true);
      return;
    }
    const saved = await createMutation.mutateAsync({
      customerId: ownerId,
      ...values,
    });
    onOpenChange(false);
    onSaved?.(saved);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{device ? "Edit Device" : "Add Device"}</DialogTitle>
          <DialogDescription>
            {device
              ? "Update this device's details."
              : "Register a device and link it to its owner."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {needsCustomerPicker && (
            <div className="space-y-1.5">
              <Label>Owner</Label>
              <Select
                value={pickedCustomerId}
                onValueChange={(v) => {
                  setPickedCustomerId(v);
                  setCustomerError(false);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} · {c.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {customerError && (
                <p className="text-xs text-destructive">
                  Select the device's owner
                </p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="Apple, Samsung..."
                {...register("brand")}
              />
              {errors.brand && (
                <p className="text-xs text-destructive">
                  {errors.brand.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="iPhone 13, Galaxy S22..."
                {...register("model")}
              />
              {errors.model && (
                <p className="text-xs text-destructive">
                  {errors.model.message}
                </p>
              )}
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="imei">IMEI / Serial Number</Label>
              <Input id="imei" {...register("imei")} />
              {errors.imei && (
                <p className="text-xs text-destructive">
                  {errors.imei.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purchaseDate">Purchase Date (optional)</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register("purchaseDate")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="conditionNotes">Condition Notes (optional)</Label>
            <Textarea
              id="conditionNotes"
              rows={2}
              {...register("conditionNotes")}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {device ? "Save Changes" : "Add Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
