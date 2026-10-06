import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Clock, ShieldCheck } from "lucide-react";

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "خصوصية تامة" },
  { icon: Clock, label: "تسليم في الموعد" },
  { icon: BadgeCheck, label: "جودة مضمونة" },
];

export function HeroSection() {
  return (
    <section
      data-ocid="home.hero.section"
      className="relative overflow-hidden border-b border-border bg-gradient-subtle"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 start-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="container relative flex flex-col items-center gap-8 py-16 text-center md:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-subtle">
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          خدمات أكاديمية موثوقة لطلاب الجامعات
        </span>

        <div className="space-y-5">
          <h1 className="text-balance font-display text-5xl font-extrabold leading-tight text-foreground sm:text-6xl md:text-7xl">
            اخدمني
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
            منصة أكاديمية متكاملة تنجز عنك تدقيق الواجبات، والعروض التقديمية،
            والأبحاث والتقارير، والترجمة، والمشاريع البرمجية — بجودة عالية
            وتسليم في الوقت المحدد.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 text-base shadow-elevated"
            data-ocid="home.hero.primary_button"
          >
            <Link to="/request">
              اطلب خدمة الآن
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base"
            data-ocid="home.hero.secondary_button"
          >
            <a href="#services">تصفح الخدمات</a>
          </Button>
        </div>

        <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {TRUST_POINTS.map((point) => (
            <li
              key={point.label}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
            >
              <point.icon className="size-4 text-primary" aria-hidden="true" />
              {point.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
