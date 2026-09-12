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
import { useSupplierOptions } from "@/features/suppliers/hooks";
import { categoryLabel } from "@/features/parts/constants";
import { useCreatePart, useUpdatePart } from "@/features/parts/hooks";
import { PART_CATEGORIES, partFormSchema, type PartFormValues } from "@/features/parts/schema";
import type { SparePart } from "@/types";

const NO_SUPPLIER = "none";

const BLANK: PartFormValues = {
  name: "",
  sku: "",
  category: "screen",
  compatibleModels: "",
  quantityInStock: 0,
  reorderLevel: 0,
  unitCost: 0,
  sellingPrice: 0,
  supplierId: NO_SUPPLIER,
};

export function PartFormDialog({
  open,
  onOpenChange,
  part,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part?: SparePart;
  onSaved?: (part: SparePart) => void;
}) {
  const { data: suppliers } = useSupplierOptions();
  const createMutation = useCreatePart();
  const updateMutation = useUpdatePart(part?.id ?? "");
  const mutation = part ? updateMutation : createMutation;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartFormValues>({ resolver: zodResolver(partFormSchema), defaultValues: BLANK });

  useEffect(() => {
    if (open) {
      reset(
        part
          ? {
              name: part.name,
              sku: part.sku,
              category: part.category,
              compatibleModels: part.compatibleModels.join(", "),
              quantityInStock: part.quantityInStock,
              reorderLevel: part.reorderLevel,
              unitCost: part.unitCost,
              sellingPrice: part.sellingPrice,
              supplierId: part.supplierId ?? NO_SUPPLIER,
            }
          : BLANK,
      );
    }
  }, [open, part, reset]);

  async function onSubmit(values: PartFormValues) {
    const input = {
      name: values.name,
      sku: values.sku,
      category: values.category,
      compatibleModels: values.compatibleModels
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      quantityInStock: values.quantityInStock,
      reorderLevel: values.reorderLevel,
      unitCost: values.unitCost,
      sellingPrice: values.sellingPrice,
      supplierId: values.supplierId === NO_SUPPLIER ? undefined : values.supplierId,
    };
    const saved = await mutation.mutateAsync(input);
    onOpenChange(false);
    onSaved?.(saved);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{part ? "Edit Spare Part" : "Add Spare Part"}</DialogTitle>
          <DialogDescription>
            {part ? "Update this part's details and stock." : "Add a new part to inventory."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Part Name</Label>
              <Input id="name" placeholder="iPhone 13 OLED Screen" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" placeholder="SCR-IP13-OLED" {...register("sku")} />
              {errors.sku && <p className="text-xs text-destructive">{errors.sku.message}</p>}
            </div>
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
                      {PART_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {categoryLabel(c)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Supplier (optional)</Label>
              <Controller
                control={control}
                name="supplierId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="No supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_SUPPLIER}>No supplier</SelectItem>
                      {suppliers?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="compatibleModels">Compatible Models</Label>
            <Input id="compatibleModels" placeholder="iPhone 13, iPhone 13 Pro" {...register("compatibleModels")} />
            {errors.compatibleModels && (
              <p className="text-xs text-destructive">{errors.compatibleModels.message}</p>
            )}
            <p className="text-xs text-muted-foreground">Comma-separated.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="quantityInStock">Quantity In Stock</Label>
              <Input
                id="quantityInStock"
                type="number"
                min={0}
                {...register("quantityInStock", { valueAsNumber: true })}
              />
              {errors.quantityInStock && <p className="text-xs text-destructive">{errors.quantityInStock.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reorderLevel">Reorder Level</Label>
              <Input id="reorderLevel" type="number" min={0} {...register("reorderLevel", { valueAsNumber: true })} />
              {errors.reorderLevel && <p className="text-xs text-destructive">{errors.reorderLevel.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="unitCost">Unit Cost (৳)</Label>
              <Input id="unitCost" type="number" min={0} {...register("unitCost", { valueAsNumber: true })} />
              {errors.unitCost && <p className="text-xs text-destructive">{errors.unitCost.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sellingPrice">Selling Price (৳)</Label>
              <Input id="sellingPrice" type="number" min={0} {...register("sellingPrice", { valueAsNumber: true })} />
              {errors.sellingPrice && <p className="text-xs text-destructive">{errors.sellingPrice.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {part ? "Save Changes" : "Add Part"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
