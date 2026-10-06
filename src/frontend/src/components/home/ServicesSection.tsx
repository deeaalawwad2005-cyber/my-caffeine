import type { ServiceType } from "@/backend";
import { Card, CardContent } from "@/components/ui/card";
import { PRICE_RANGE_NOTICE, SERVICE_TYPES } from "@/lib/service-types";
import {
  BadgeDollarSign,
  BookOpenCheck,
  Code2,
  FileText,
  Languages,
  MonitorPlay,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SERVICE_ICONS: Record<ServiceType, LucideIcon> = {
  homework: BookOpenCheck,
  presentation: MonitorPlay,
  research: FileText,
  translation: Languages,
  programming: Code2,
  other: Sparkles,
};

export function ServicesSection() {
  return (
    <section
      id="services"
      data-ocid="home.services.section"
      className="scroll-mt-24 border-b border-border bg-background py-16 md:py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            خدماتنا
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
            كل ما تحتاجه في مكان واحد
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-muted-foreground">
            اختر نوع الخدمة الأكاديمية التي تريدها، وسنتولى الباقي من أول الطلب
            حتى التسليم.
          </p>
          <div
            data-ocid="home.services.price_range.notice"
            className="mx-auto mt-6 inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-medium text-foreground"
          >
            <BadgeDollarSign
              className="size-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>{PRICE_RANGE_NOTICE}</span>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_TYPES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.value];
            return (
              <Card
                key={service.value}
                data-ocid={`home.services.card.${index + 1}`}
                className="group border-border bg-card shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated"
              >
                <CardContent className="flex flex-col gap-4 p-6">
                  <span className="flex size-12 items-center justify-center rounded-lg bg-secondary text-primary transition-smooth group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {service.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
