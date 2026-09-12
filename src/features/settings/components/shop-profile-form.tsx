import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useShopSettings, useUpdateShopSettings } from "@/features/settings/hooks";
import { shopSettingsFormSchema, type ShopSettingsFormValues } from "@/features/settings/schema";

export function ShopProfileForm() {
  const { data, isLoading } = useShopSettings();
  const mutation = useUpdateShopSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ShopSettingsFormValues>({ resolver: zodResolver(shopSettingsFormSchema) });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  async function onSubmit(values: ShopSettingsFormValues) {
    await mutation.mutateAsync(values);
    reset(values);
  }

  if (isLoading || !data) {
    return <Skeleton className="h-80 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Profile</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input id="shopName" {...register("shopName")} />
            {errors.shopName && <p className="text-xs text-destructive">{errors.shopName.message}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>
          <div className="space-y-1.5 sm:max-w-[200px]">
            <Label htmlFor="taxRatePercent">Tax Rate (%)</Label>
            <Input
              id="taxRatePercent"
              type="number"
              min={0}
              max={100}
              step="0.01"
              {...register("taxRatePercent", { valueAsNumber: true })}
            />
            {errors.taxRatePercent && <p className="text-xs text-destructive">{errors.taxRatePercent.message}</p>}
            <p className="text-xs text-muted-foreground">
              Applied to every invoice generated when a service order is closed.
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
