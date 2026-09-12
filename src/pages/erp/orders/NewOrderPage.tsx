import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronLeft, ChevronRight, Plus, Smartphone, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { createCustomer, getCustomers } from "@/features/customers/api";
import { createDevice, getDevicesByCustomer } from "@/features/devices/api";
import { ACCESSORY_OPTIONS } from "@/features/orders/constants";
import { useCreateOrder } from "@/features/orders/hooks";
import { newOrderSchema, type NewOrderValues } from "@/features/orders/schema";
import { cn } from "@/lib/utils";

const STEPS = ["Customer", "Device", "Problem Details", "Review"];

const ISSUE_TAGS = ["Screen Damage", "Battery", "Charging Port", "Water Damage", "Software", "Camera", "Speaker/Mic"];

export function NewOrderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [showNewDevice, setShowNewDevice] = useState(false);
  const [newCustomerFields, setNewCustomerFields] = useState({ name: "", phone: "", email: "" });
  const [newDeviceFields, setNewDeviceFields] = useState({ brand: "", model: "", imei: "", color: "" });

  const queryClient = useQueryClient();
  const { data: customers, isLoading: loadingCustomers } = useQuery({ queryKey: ["customers"], queryFn: getCustomers });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<NewOrderValues>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: { priority: "normal", accessoriesReceived: [] },
  });

  const customerId = watch("customerId");
  const deviceId = watch("deviceId");
  const accessoriesReceived = watch("accessoriesReceived") ?? [];
  const reportedIssue = watch("reportedIssue") ?? "";

  const { data: devices, isLoading: loadingDevices } = useQuery({
    queryKey: ["devices", customerId],
    queryFn: () => getDevicesByCustomer(customerId),
    enabled: Boolean(customerId),
  });

  const createCustomerMutation = useMutation({
    mutationFn: () => createCustomer(newCustomerFields),
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setValue("customerId", customer.id, { shouldValidate: true });
      setShowNewCustomer(false);
      setNewCustomerFields({ name: "", phone: "", email: "" });
      toast.success(`${customer.name} added.`);
    },
  });

  const createDeviceMutation = useMutation({
    mutationFn: () => createDevice({ customerId, ...newDeviceFields }),
    onSuccess: (device) => {
      queryClient.invalidateQueries({ queryKey: ["devices", customerId] });
      setValue("deviceId", device.id, { shouldValidate: true });
      setShowNewDevice(false);
      setNewDeviceFields({ brand: "", model: "", imei: "", color: "" });
      toast.success(`${device.brand} ${device.model} registered.`);
    },
  });

  const createOrder = useCreateOrder();

  const selectedCustomer = customers?.find((c) => c.id === customerId);
  const selectedDevice = devices?.find((d) => d.id === deviceId);

  async function goNext() {
    const fieldsPerStep: (keyof NewOrderValues)[][] = [["customerId"], ["deviceId"], ["reportedIssue", "priority"], []];
    const valid = await trigger(fieldsPerStep[step]);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function toggleAccessory(item: string, checked: boolean) {
    setValue(
      "accessoriesReceived",
      checked ? [...accessoriesReceived, item] : accessoriesReceived.filter((a) => a !== item),
    );
  }

  function appendTag(tag: string) {
    setValue("reportedIssue", reportedIssue ? `${reportedIssue}, ${tag}` : tag);
  }

  async function onSubmit(values: NewOrderValues) {
    const order = await createOrder.mutateAsync(values);
    navigate(`/app/orders/${order.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="New Service Order" description="Register a device intake and start the repair workflow." />

      <div className="flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  i < step ? "border-primary bg-primary text-primary-foreground" : i === step ? "border-primary text-primary" : "border-border text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-xs font-medium", i <= step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={cn("mx-2 h-px flex-1", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card>
          <CardContent className="space-y-4 p-6">
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-foreground">Select the customer</h2>
                {loadingCustomers ? (
                  <Skeleton className="h-40" />
                ) : (
                  <div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
                    {customers?.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setValue("customerId", c.id, { shouldValidate: true })}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md border p-3 text-left text-sm transition-colors",
                          customerId === c.id ? "border-primary bg-primary/5" : "border-input hover:bg-accent",
                        )}
                      >
                        <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">{c.name}</span>
                          <span className="block text-xs text-muted-foreground">{c.phone}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.customerId && <p className="text-xs text-destructive">{errors.customerId.message}</p>}

                {!showNewCustomer ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowNewCustomer(true)}>
                    <Plus /> New Customer
                  </Button>
                ) : (
                  <div className="space-y-3 rounded-md border border-dashed border-border p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label>Name</Label>
                        <Input
                          value={newCustomerFields.name}
                          onChange={(e) => setNewCustomerFields((f) => ({ ...f, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Phone</Label>
                        <Input
                          value={newCustomerFields.phone}
                          onChange={(e) => setNewCustomerFields((f) => ({ ...f, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Email (optional)</Label>
                      <Input
                        value={newCustomerFields.email}
                        onChange={(e) => setNewCustomerFields((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={!newCustomerFields.name || !newCustomerFields.phone || createCustomerMutation.isPending}
                        onClick={() => createCustomerMutation.mutate()}
                      >
                        Add Customer
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setShowNewCustomer(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-foreground">
                  Select {selectedCustomer?.name ? `${selectedCustomer.name}'s` : "the"} device
                </h2>
                {loadingDevices ? (
                  <Skeleton className="h-32" />
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {devices?.map((d) => (
                      <button
                        type="button"
                        key={d.id}
                        onClick={() => setValue("deviceId", d.id, { shouldValidate: true })}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md border p-3 text-left text-sm transition-colors",
                          deviceId === d.id ? "border-primary bg-primary/5" : "border-input hover:bg-accent",
                        )}
                      >
                        <Smartphone className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-foreground">
                            {d.brand} {d.model}
                          </span>
                          <span className="block text-xs text-muted-foreground">IMEI {d.imei}</span>
                        </span>
                      </button>
                    ))}
                    {devices?.length === 0 && (
                      <p className="col-span-2 text-sm text-muted-foreground">No devices on file for this customer yet.</p>
                    )}
                  </div>
                )}
                {errors.deviceId && <p className="text-xs text-destructive">{errors.deviceId.message}</p>}

                {!showNewDevice ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowNewDevice(true)}>
                    <Plus /> Register New Device
                  </Button>
                ) : (
                  <div className="space-y-3 rounded-md border border-dashed border-border p-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label>Brand</Label>
                        <Input
                          value={newDeviceFields.brand}
                          onChange={(e) => setNewDeviceFields((f) => ({ ...f, brand: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Model</Label>
                        <Input
                          value={newDeviceFields.model}
                          onChange={(e) => setNewDeviceFields((f) => ({ ...f, model: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>IMEI / Serial</Label>
                        <Input
                          value={newDeviceFields.imei}
                          onChange={(e) => setNewDeviceFields((f) => ({ ...f, imei: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Color (optional)</Label>
                        <Input
                          value={newDeviceFields.color}
                          onChange={(e) => setNewDeviceFields((f) => ({ ...f, color: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={!newDeviceFields.brand || !newDeviceFields.model || !newDeviceFields.imei || createDeviceMutation.isPending}
                        onClick={() => createDeviceMutation.mutate()}
                      >
                        Add Device
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setShowNewDevice(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="reportedIssue">Reported Issue</Label>
                  <Textarea id="reportedIssue" rows={3} placeholder="e.g. Screen cracked, won't charge..." {...register("reportedIssue")} />
                  {errors.reportedIssue && <p className="text-xs text-destructive">{errors.reportedIssue.message}</p>}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ISSUE_TAGS.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => appendTag(tag)}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <div className="flex gap-2">
                        {(["normal", "urgent"] as const).map((p) => (
                          <button
                            type="button"
                            key={p}
                            onClick={() => field.onChange(p)}
                            className={cn(
                              "rounded-md border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                              field.value === p
                                ? p === "urgent"
                                  ? "border-destructive bg-destructive/10 text-destructive"
                                  : "border-primary bg-primary/10 text-primary"
                                : "border-input text-muted-foreground hover:bg-accent",
                            )}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Accessories Received</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ACCESSORY_OPTIONS.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox
                          id={`new-acc-${item}`}
                          checked={accessoriesReceived.includes(item)}
                          onCheckedChange={(c) => toggleAccessory(item, Boolean(c))}
                        />
                        <Label htmlFor={`new-acc-${item}`} className="text-sm font-normal">
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="conditionNotes">Condition Notes (optional)</Label>
                  <Textarea id="conditionNotes" rows={2} {...register("conditionNotes")} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="font-semibold text-foreground">Review & Submit</h2>
                <dl className="grid grid-cols-1 gap-3 rounded-md border border-border p-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Customer</dt>
                    <dd className="font-medium text-foreground">{selectedCustomer?.name ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Device</dt>
                    <dd className="font-medium text-foreground">
                      {selectedDevice ? `${selectedDevice.brand} ${selectedDevice.model}` : "—"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted-foreground">Reported Issue</dt>
                    <dd className="text-foreground">{reportedIssue || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Priority</dt>
                    <dd>
                      <Badge variant={watch("priority") === "urgent" ? "destructive" : "secondary"} className="capitalize">
                        {watch("priority")}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Accessories</dt>
                    <dd className="text-foreground">{accessoriesReceived.join(", ") || "None"}</dd>
                  </div>
                </dl>
                <div className="space-y-1.5">
                  <Label htmlFor="ballparkEstimateNote">Internal Note (optional)</Label>
                  <Textarea
                    id="ballparkEstimateNote"
                    rows={2}
                    placeholder="e.g. Customer quoted a ballpark verbally — not final."
                    {...register("ballparkEstimateNote")}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-between">
          <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <ChevronLeft /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button key="next" type="button" onClick={goNext}>
              Next <ChevronRight />
            </Button>
          ) : (
            <Button key="submit" type="submit" disabled={createOrder.isPending}>
              Create Service Order
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
