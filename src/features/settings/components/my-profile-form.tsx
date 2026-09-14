import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store";
import { useUpdateMyProfile } from "@/features/settings/hooks";
import {
  myProfileFormSchema,
  type MyProfileFormValues,
} from "@/features/settings/schema";
import { humanizeStatus } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function MyProfileForm() {
  const user = useAuthStore((s) => s.user);
  const mutation = useUpdateMyProfile(user?.id ?? "");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<MyProfileFormValues>({
    resolver: zodResolver(myProfileFormSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email });
  }, [user, reset]);

  async function onSubmit(values: MyProfileFormValues) {
    await mutation.mutateAsync(values);
    reset(values);
  }

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="my-name">Full Name</Label>
            <Input id="my-name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="my-email">Email</Label>
            <Input id="my-email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-primary">
                {" "}
                {humanizeStatus(user.role)}{" "}
              </span>{" "}
              contact an admin to change your role.
            </p>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!isDirty || mutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
