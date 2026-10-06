import { RequestConfirmation } from "@/components/request/RequestConfirmation";
import { RequestForm } from "@/components/request/RequestForm";
import type { ServiceRequest } from "@/lib/backend";
import { phoneHref, whatsappHref } from "@/lib/format";
import {
  ClipboardList,
  MessageCircle,
  Phone,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { useState } from "react";

const CONTACT_PHONE = "0781389411";

const ASSURANCES = [
  {
    icon: ShieldCheck,
    title: "بياناتك محفوظة",
    description: "نستخدم معلوماتك للتواصل بشأن طلبك فقط.",
  },
  {
    icon: Timer,
    title: "رد سريع",
    description: "نتواصل معك لتأكيد التفاصيل والموعد النهائي.",
  },
  {
    icon: ClipboardList,
    title: "متابعة واضحة",
    description: "رقم مرجعي لمتابعة حالة طلبك خطوة بخطوة.",
  },
];

export function RequestPage() {
  const [submitted, setSubmitted] = useState<ServiceRequest | null>(null);

  return (
    <div className="bg-gradient-subtle">
      <div className="container max-w-6xl py-10 md:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-primary shadow-subtle">
            <ClipboardList className="size-3.5" aria-hidden="true" />
            طلب خدمة أكاديمية
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            اطلب خدمتك الأكاديمية
          </h1>
          <p className="mt-4 text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
            املأ النموذج التالي بتفاصيل طلبك، وسيتواصل معك فريقنا لتأكيد
            المتطلبات والموعد النهائي.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div
            data-ocid="request.panel"
            className="rounded-2xl border border-border bg-card p-6 shadow-subtle md:p-8"
          >
            {submitted ? (
              <RequestConfirmation
                request={submitted}
                onNewRequest={() => setSubmitted(null)}
              />
            ) : (
              <RequestForm onSubmitted={setSubmitted} />
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div
              data-ocid="request.contact_panel"
              className="rounded-2xl border border-border bg-card p-5 shadow-subtle"
            >
              <h2 className="font-display text-sm font-semibold text-foreground">
                تفضّل التواصل المباشر؟
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                راسلنا عبر واتساب أو اتصل بنا وسنساعدك في تجهيز طلبك.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <a
                  href={whatsappHref(CONTACT_PHONE)}
                  target="_blank"
                  rel="noreferrer"
                  data-ocid="request.whatsapp_button"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-subtle transition-smooth hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <MessageCircle
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  تواصل عبر واتساب
                </a>
                <a
                  href={phoneHref(CONTACT_PHONE)}
                  data-ocid="request.phone_link"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-smooth hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Phone className="size-4 shrink-0" aria-hidden="true" />
                  <span dir="ltr">{CONTACT_PHONE}</span>
                </a>
              </div>
            </div>

            {ASSURANCES.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3.5 rounded-2xl border border-border bg-card p-5 shadow-subtle"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <item.icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-sm font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}
