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
import { useCreateSupplier, useUpdateSupplier } from "@/features/suppliers/hooks";
import { supplierFormSchema, type SupplierFormValues } from "@/features/suppliers/schema";
import type { Supplier } from "@/types";

const BLANK: SupplierFormValues = { name: "", contactPerson: "", phone: "", email: "", address: "" };

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier?: Supplier;
  onSaved?: (supplier: Supplier) => void;
}) {
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier(supplier?.id ?? "");
  const mutation = supplier ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({ resolver: zodResolver(supplierFormSchema), defaultValues: BLANK });

  useEffect(() => {
    if (open) {
      reset(
        supplier
          ? {
              name: supplier.name,
              contactPerson: supplier.contactPerson,
              phone: supplier.phone,
              email: supplier.email ?? "",
              address: supplier.address ?? "",
            }
          : BLANK,
      );
    }
  }, [open, supplier, reset]);

  async function onSubmit(values: SupplierFormValues) {
    const saved = await mutation.mutateAsync(values);
    onOpenChange(false);
    onSaved?.(saved);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{supplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          <DialogDescription>
            {supplier ? "Update this supplier's details." : "Add a new parts supplier to the system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">Supplier Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" {...register("contactPerson")} />
              {errors.contactPerson && <p className="text-xs text-destructive">{errors.contactPerson.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address (optional)</Label>
            <Input id="address" {...register("address")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {supplier ? "Save Changes" : "Add Supplier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
