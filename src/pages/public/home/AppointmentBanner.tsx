import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/motion/reveal";

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
    <section className="bg-primary text-primary-foreground">
      <Reveal className="container grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="flex items-start gap-4">
          <CalendarClock className="mt-1 h-9 w-9 shrink-0" />
          <div>
            <h3 className="text-xl font-bold">Make Appointment Today</h3>
            <p className="mt-1 text-sm text-primary-foreground/85">
              Reserve a slot online and skip the wait — a technician will confirm within minutes.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <div>
            <Input
              placeholder="Name"
              aria-label="Name"
              aria-invalid={!!errors.name}
              className="rounded-none border-white/30 bg-white/10 text-white placeholder:text-white/70 focus-visible:ring-white"
              {...register("name")}
            />
            {errors.name && <p className="mt-1 text-xs text-white">{errors.name.message}</p>}
          </div>
          <div>
            <Input
              placeholder="Email"
              aria-label="Email"
              aria-invalid={!!errors.email}
              className="rounded-none border-white/30 bg-white/10 text-white placeholder:text-white/70 focus-visible:ring-white"
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-xs text-white">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              placeholder="Phone"
              aria-label="Phone"
              aria-invalid={!!errors.phone}
              className="rounded-none border-white/30 bg-white/10 text-white placeholder:text-white/70 focus-visible:ring-white"
              {...register("phone")}
            />
            {errors.phone && <p className="mt-1 text-xs text-white">{errors.phone.message}</p>}
          </div>
          <Button
            type="submit"
            variant="secondary"
            disabled={isSubmitting}
            className="rounded-none px-6 text-[13px] font-semibold uppercase tracking-wider"
          >
            Book Now
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
