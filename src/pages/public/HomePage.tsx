import { AboutSection } from "./home/AboutSection";
import { AppointmentBanner } from "./home/AppointmentBanner";
import { BrandsStrip } from "./home/BrandsStrip";
import { CtaSection } from "./home/CtaSection";
import { HeroSection } from "./home/HeroSection";
import { IssuesGridSection } from "./home/IssuesGridSection";
import { PricingSection } from "./home/PricingSection";
import { ProcessSection } from "./home/ProcessSection";
import { QuickActionsSection } from "./home/QuickActionsSection";
import { ServicesSection } from "./home/ServicesSection";
import { SkillsSection } from "./home/SkillsSection";
import { TeamPreviewSection } from "./home/TeamPreviewSection";
import { TestimonialsSection } from "./home/TestimonialsSection";
import { WhyChooseUsSection } from "./home/WhyChooseUsSection";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickActionsSection />
      <AboutSection />
      <AppointmentBanner />
      <SkillsSection />
      <BrandsStrip />
      <ProcessSection />
      <WhyChooseUsSection />
      <IssuesGridSection />
      <ServicesSection />
      <TeamPreviewSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />
    </>
  );
}
