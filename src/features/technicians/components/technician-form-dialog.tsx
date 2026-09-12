import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { useCreateTechnician, useUpdateTechnician } from "@/features/technicians/hooks";
import { TECHNICIAN_SPECIALTIES, technicianFormSchema, type TechnicianFormValues } from "@/features/technicians/schema";
import { humanizeStatus } from "@/lib/utils";
import type { Technician } from "@/types";

const BLANK: TechnicianFormValues = { name: "", phone: "", email: "", specialties: [] };

export function TechnicianFormDialog({
  open,
  onOpenChange,
  technician,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician?: Technician;
  onSaved?: (technician: Technician) => void;
}) {
  const createMutation = useCreateTechnician();
  const updateMutation = useUpdateTechnician(technician?.id ?? "");
  const mutation = technician ? updateMutation : createMutation;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TechnicianFormValues>({ resolver: zodResolver(technicianFormSchema), defaultValues: BLANK });

  useEffect(() => {
    if (open) {
      reset(
        technician
          ? {
              name: technician.name,
              phone: technician.phone,
              email: technician.email ?? "",
              specialties: technician.specialties,
            }
          : BLANK,
      );
    }
  }, [open, technician, reset]);

  async function onSubmit(values: TechnicianFormValues) {
    const saved = await mutation.mutateAsync(values);
    onOpenChange(false);
    onSaved?.(saved);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{technician ? "Edit Technician" : "Add Technician"}</DialogTitle>
          <DialogDescription>
            {technician ? "Update this technician's details." : "Add a new technician to the team."}
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
          <div className="space-y-1.5">
            <Label htmlFor="email">Email (optional)</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Specialties</Label>
            <Controller
              control={control}
              name="specialties"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
                  {TECHNICIAN_SPECIALTIES.map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <Checkbox
                        id={`spec-${s}`}
                        checked={field.value.includes(s)}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? [...field.value, s] : field.value.filter((v) => v !== s))
                        }
                      />
                      <Label htmlFor={`spec-${s}`} className="text-sm font-normal">
                        {humanizeStatus(s)}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
            {errors.specialties && <p className="text-xs text-destructive">{errors.specialties.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {technician ? "Save Changes" : "Add Technician"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
