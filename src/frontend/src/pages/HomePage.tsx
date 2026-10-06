import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function HomePage() {
  return (
    <div data-ocid="home.page">
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <FaqSection />

      <section
        data-ocid="home.cta.section"
        className="border-t border-border bg-gradient-primary py-16 md:py-20"
      >
        <div className="container flex flex-col items-center gap-6 text-center">
          <h2 className="text-balance font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            جاهز لإنجاز عملك الأكاديمي؟
          </h2>
          <p className="max-w-xl text-balance leading-relaxed text-primary-foreground/85">
            قدّم طلبك الآن وسنتواصل معك في أقرب وقت لتأكيد التفاصيل والبدء في
            التنفيذ.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="rounded-full px-8 text-base shadow-elevated"
            data-ocid="home.cta.primary_button"
          >
            <Link to="/request">
              اطلب خدمة الآن
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
