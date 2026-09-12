import { CtaSection } from "./home/CtaSection";
import { HeroSection } from "./home/HeroSection";
import { PricingSection } from "./home/PricingSection";
import { ProcessSection } from "./home/ProcessSection";
import { ServicesSection } from "./home/ServicesSection";
import { StatsSection } from "./home/StatsSection";
import { TeamPreviewSection } from "./home/TeamPreviewSection";
import { TestimonialsSection } from "./home/TestimonialsSection";
import { WhyChooseUsSection } from "./home/WhyChooseUsSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ProcessSection />
      <WhyChooseUsSection />
      <PricingSection />
      <TeamPreviewSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
