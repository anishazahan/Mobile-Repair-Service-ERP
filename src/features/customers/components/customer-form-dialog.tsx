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
import { useCreateCustomer, useUpdateCustomer } from "@/features/customers/hooks";
import { customerFormSchema, type CustomerFormValues } from "@/features/customers/schema";
import type { Customer } from "@/types";

const BLANK: CustomerFormValues = { name: "", phone: "", email: "", address: "", type: "walk_in", notes: "" };

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pass an existing customer to edit it in place; omit to create a new one. */
  customer?: Customer;
  onSaved?: (customer: Customer) => void;
}) {
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer(customer?.id ?? "");
  const mutation = customer ? updateMutation : createMutation;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: BLANK,
  });

  useEffect(() => {
    if (open) {
      reset(
        customer
          ? {
              name: customer.name,
              phone: customer.phone,
              email: customer.email ?? "",
              address: customer.address ?? "",
              type: customer.type,
              notes: customer.notes ?? "",
            }
          : BLANK,
      );
    }
  }, [open, customer, reset]);

  async function onSubmit(values: CustomerFormValues) {
    const saved = await mutation.mutateAsync(values);
    onOpenChange(false);
    onSaved?.(saved);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>
          <DialogDescription>
            {customer ? "Update this customer's contact details and notes." : "Add a new customer to the system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email (optional)</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Customer Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walk_in">Walk-in</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address (optional)</Label>
            <Input id="address" {...register("address")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {customer ? "Save Changes" : "Add Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
