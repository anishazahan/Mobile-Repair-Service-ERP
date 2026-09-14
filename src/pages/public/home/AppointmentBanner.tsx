import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const appointmentSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter a valid phone number"),
});

type AppointmentValues = z.infer<typeof appointmentSchema>;

export function AppointmentBanner() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentValues>({ resolver: zodResolver(appointmentSchema) });

  async function onSubmit() {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Thanks! We'll call you shortly to confirm your slot.");
    reset();
  }

  return (
    <section className="relative overflow-hidden bg-background py-8 lg:py-0">
      <Reveal className="container grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Left Side: White background text & icon */}
        <div className="flex items-start gap-4 py-6 text-foreground">
          <CalendarClock className="mt-1 h-9 w-9 shrink-0 text-primary" />
          <div className="max-w-sm">
            <h3 className="text-xl font-bold leading-tight text-foreground">
              Make Appointment
              <br />
              Today
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Reserve a slot online and skip the wait a technician will confirm
              within minutes.
            </p>
          </div>
        </div>

        {/* Right Side: Blue block expanding to screen edge */}
        <div className="relative flex items-center bg-primary py-8 text-primary-foreground lg:py-12 pl-5">
          {/* Bleed overlay to extend background color to the right viewport border */}
          <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-screen bg-primary" />

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="grid w-full items-start gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] lg:pr-8"
          >
            <div>
              <Input
                placeholder="Name"
                aria-label="Name"
                aria-invalid={!!errors.name}
                className="h-11 rounded-none border-0 bg-white text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-primary"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-white/90">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Email"
                aria-label="Email"
                aria-invalid={!!errors.email}
                className="h-11 rounded-none border-0 bg-white text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-primary"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-white/90">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                placeholder="Phone"
                aria-label="Phone"
                aria-invalid={!!errors.phone}
                className="h-11 rounded-none border-0 bg-white text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:ring-1 focus-views-primary"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-white/90">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-none border border-white/60 bg-transparent px-7 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white hover:text-primary"
            >
              Book Now
            </Button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
