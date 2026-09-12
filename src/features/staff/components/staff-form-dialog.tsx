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
import { useTechnicianOptions } from "@/features/technicians/hooks";
import { useCreateStaffUser, useUpdateStaffUser } from "@/features/staff/hooks";
import { staffFormSchema, type StaffFormValues } from "@/features/staff/schema";
import { humanizeStatus } from "@/lib/utils";
import type { Role, StaffUser } from "@/types";

const NO_TECHNICIAN = "none";
const ROLES: Role[] = ["admin", "manager", "front_desk", "technician"];

const BLANK: StaffFormValues = { name: "", email: "", role: "front_desk", linkedTechnicianId: NO_TECHNICIAN };

export function StaffFormDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: StaffUser;
  onSaved?: (user: StaffUser) => void;
}) {
  const { data: technicians } = useTechnicianOptions();
  const createMutation = useCreateStaffUser();
  const updateMutation = useUpdateStaffUser(user?.id ?? "");
  const mutation = user ? updateMutation : createMutation;

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<StaffFormValues>({ resolver: zodResolver(staffFormSchema), defaultValues: BLANK });
  const role = watch("role");

  useEffect(() => {
    if (open) {
      reset(
        user
          ? {
              name: user.name,
              email: user.email,
              role: user.role,
              linkedTechnicianId: user.linkedTechnicianId ?? NO_TECHNICIAN,
            }
          : BLANK,
      );
    }
  }, [open, user, reset]);

  async function onSubmit(values: StaffFormValues) {
    const saved = await mutation.mutateAsync({
      name: values.name,
      email: values.email,
      role: values.role,
      linkedTechnicianId: values.linkedTechnicianId === NO_TECHNICIAN ? undefined : values.linkedTechnicianId,
    });
    onOpenChange(false);
    onSaved?.(saved);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit Staff Account" : "Add Staff Account"}</DialogTitle>
          <DialogDescription>
            {user ? "Update this account's details and role." : "Add a new staff account to the system."}
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {humanizeStatus(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {role === "technician" && (
            <div className="space-y-1.5">
              <Label>Linked Technician Profile</Label>
              <Controller
                control={control}
                name="linkedTechnicianId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="No technician profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_TECHNICIAN}>No technician profile</SelectItem>
                      {technicians?.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-muted-foreground">
                Links this login to a technician profile, so their jobs and performance show up on their account.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {user ? "Save Changes" : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
