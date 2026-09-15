import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_PASSWORD, login } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Wrench } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@gadgetfix.shop" },
  { role: "Manager", email: "manager@gadgetfix.shop" },
  { role: "Front Desk", email: "frontdesk@gadgetfix.shop" },
  { role: "Technician", email: "ahmed.karim@gadgetfix.shop" },
];

export function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logIn = useAuthStore((s) => s.logIn);
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: Location })?.from?.pathname ?? "/app";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const session = await login(values.email, values.password);
      logIn(session.user, session.token);
      toast.success(`Welcome back, ${session.user.name.split(" ")[0]}`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function fillDemoAccount(email: string) {
    setValue("email", email);
    setValue("password", DEMO_PASSWORD);
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.5), transparent 45%), radial-gradient(circle at 80% 70%, rgba(14,165,233,0.35), transparent 45%)",
          }}
        />
        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">GadgetFIX ERP</span>
        </Link>
        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="text-3xl font-semibold leading-tight">
            Run the whole repair shop from one screen.
          </h1>
          <p className="text-slate-300">
            Track every device from intake to delivery, manage inventory,
            technicians, billing and reporting all in one purpose-built ERP for
            mobile repair businesses.
          </p>
        </div>
        <p className="relative z-10 text-sm text-slate-400">
          © 2026 GadgetFIX. All rights reserved By{" "}
          <span className="font-bold text-primary">Anisha Zahan</span>
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-1.5 lg:hidden">
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="font-semibold">GadgetFIX ERP</span>
            </Link>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground">
              Enter your staff credentials to access the ERP.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@gadgetfix.shop"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
            <p className="text-xs font-medium text-foreground">
              Demo accounts (password: {DEMO_PASSWORD})
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemoAccount(acc.email)}
                  className="rounded-md border border-border px-2 py-1.5 text-left  transition-colors hover:bg-primary/30"
                >
                  <span className="block text-sm font-medium text-black">
                    {acc.role}
                  </span>
                  <span className="block text-[13px] truncate text-muted-foreground">
                    {acc.email}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <Link to="/" className="font-medium text-primary hover:underline">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
