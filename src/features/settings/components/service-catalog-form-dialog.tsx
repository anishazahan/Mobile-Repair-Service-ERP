import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { useCreateServiceCatalogItem, useUpdateServiceCatalogItem } from "@/features/settings/hooks";
import {
  SERVICE_CATALOG_CATEGORIES,
  serviceCatalogFormSchema,
  type ServiceCatalogFormValues,
} from "@/features/settings/schema";
import type { ServiceCatalogItem } from "@/types";

const BLANK: ServiceCatalogFormValues = {
  name: "",
  category: SERVICE_CATALOG_CATEGORIES[0],
  basePrice: 0,
  estDurationMinutes: 30,
  description: "",
};

export function ServiceCatalogFormDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ServiceCatalogItem;
}) {
  const createMutation = useCreateServiceCatalogItem();
  const updateMutation = useUpdateServiceCatalogItem(item?.id ?? "");
  const mutation = item ? updateMutation : createMutation;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceCatalogFormValues>({ resolver: zodResolver(serviceCatalogFormSchema), defaultValues: BLANK });

  useEffect(() => {
    if (open) {
      reset(
        item
          ? {
              name: item.name,
              category: item.category,
              basePrice: item.basePrice,
              estDurationMinutes: item.estDurationMinutes,
              description: item.description ?? "",
            }
          : BLANK,
      );
    }
  }, [open, item, reset]);

  async function onSubmit(values: ServiceCatalogFormValues) {
    await mutation.mutateAsync(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit Service" : "Add Service"}</DialogTitle>
          <DialogDescription>
            {item ? "Update this service's pricing and details." : "Add a new service to the price list."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="svc-name">Service Name</Label>
            <Input id="svc-name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATALOG_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-duration">Est. Duration (minutes)</Label>
              <Input
                id="svc-duration"
                type="number"
                min={1}
                {...register("estDurationMinutes", { valueAsNumber: true })}
              />
              {errors.estDurationMinutes && (
                <p className="text-xs text-destructive">{errors.estDurationMinutes.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-1.5 sm:max-w-[200px]">
            <Label htmlFor="svc-price">Base Price (৳)</Label>
            <Input id="svc-price" type="number" min={0} {...register("basePrice", { valueAsNumber: true })} />
            {errors.basePrice && <p className="text-xs text-destructive">{errors.basePrice.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="svc-description">Description (optional)</Label>
            <Textarea id="svc-description" rows={2} {...register("description")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {item ? "Save Changes" : "Add Service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
