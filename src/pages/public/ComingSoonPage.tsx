import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { useShopSettings } from "@/features/settings/hooks";
import { PhoneCall, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK_PHONE = "+880 1700-000000";

interface ComingSoonPageProps {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export function ComingSoonPage({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
}: ComingSoonPageProps) {
  const { data: shop } = useShopSettings();
  const phone = shop?.phone ?? FALLBACK_PHONE;
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section className="container py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-4 w-4" /> {eyebrow}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-muted-foreground">{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            className="rounded-none px-7 text-[13px] font-semibold uppercase tracking-wider"
            asChild
          >
            <Link to="/">Back to Home</Link>
          </Button>
          <Button
            variant="outline"
            className="rounded-none px-7 text-[13px] font-semibold uppercase tracking-wider"
            asChild
          >
            <a href={telHref}>
              <PhoneCall className="h-4 w-4" /> Call Us Now
            </a>
          </Button>
        </div>
      </Reveal>

      <Reveal
        direction="zoom"
        delay={150}
        className="relative mx-auto mt-14 max-w-4xl"
      >
        <img
          src={image}
          alt={imageAlt}
          className="aspect-video w-full border-4 border-primary object-cover shadow-lg"
        />
        <span className="absolute -bottom-4 left-8 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-md">
          This Page Is Coming Soon
        </span>
      </Reveal>
    </section>
  );
}
