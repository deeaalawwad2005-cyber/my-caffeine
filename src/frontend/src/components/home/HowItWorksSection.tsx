import { PRICE_RANGE_NOTICE } from "@/lib/service-types";
import { ClipboardList, MessageSquareText, PackageCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  note?: string;
}

const STEPS: Step[] = [
  {
    icon: ClipboardList,
    title: "قدّم الطلب",
    description:
      "اختر نوع الخدمة واكتب تفاصيل طلبك مع الاسم ورقم التواصل في دقيقة واحدة.",
  },
  {
    icon: MessageSquareText,
    title: "نتواصل معك",
    description:
      "يتواصل معك فريقنا لتأكيد التفاصيل والموعد المطلوب للتسليم والاتفاق على السعر.",
    note: PRICE_RANGE_NOTICE,
  },
  {
    icon: PackageCheck,
    title: "تستلم العمل",
    description:
      "تستلم عملك جاهزًا بجودة عالية في الموعد المتفق عليه، مع إمكانية التعديل.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      data-ocid="home.how_it_works.section"
      className="scroll-mt-24 border-b border-border bg-secondary/40 py-16 md:py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            كيف نعمل
          </span>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold text-foreground md:text-4xl">
            ثلاث خطوات فقط تفصلك عن إنجاز عملك
          </h2>
          <p className="mt-4 text-balance leading-relaxed text-muted-foreground">
            عملية بسيطة وواضحة من لحظة تقديم الطلب حتى استلام العمل النهائي.
          </p>
        </div>

        <ol className="relative mt-12 grid gap-8 md:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-8 hidden h-px bg-border md:block"
          />
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-ocid={`home.how_it_works.step.${index + 1}`}
              className="relative flex flex-col items-center gap-4 text-center"
            >
              <span className="relative z-10 flex size-16 items-center justify-center rounded-full border border-border bg-card text-primary shadow-subtle">
                <step.icon className="size-7" aria-hidden="true" />
                <span className="absolute -top-1 -end-1 flex size-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {index + 1}
                </span>
              </span>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                {step.note ? (
                  <p
                    data-ocid={`home.how_it_works.step.${index + 1}.price_range`}
                    className="mx-auto mt-1 inline-flex max-w-xs items-center rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-medium text-foreground"
                  >
                    {step.note}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
