import { Button } from "@/components/ui/button";
import type { ServiceRequest } from "@/lib/backend";
import { formatDeadline, formatPhone } from "@/lib/format";
import { serviceTypeLabel } from "@/lib/service-types";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Home, Plus } from "lucide-react";

interface RequestConfirmationProps {
  request: ServiceRequest;
  onNewRequest: () => void;
}

interface SummaryRow {
  label: string;
  value: string;
  ltr?: boolean;
}

export function RequestConfirmation({
  request,
  onNewRequest,
}: RequestConfirmationProps) {
  const rows: SummaryRow[] = [
    { label: "نوع الخدمة", value: serviceTypeLabel(request.serviceType) },
    { label: "الاسم الكامل", value: request.fullName },
    { label: "رقم الهاتف", value: formatPhone(request.phone), ltr: true },
  ];

  if (request.email) {
    rows.push({ label: "البريد الإلكتروني", value: request.email, ltr: true });
  }
  if (request.university) {
    rows.push({ label: "الجامعة / التخصص", value: request.university });
  }
  if (request.deadline) {
    rows.push({
      label: "الموعد النهائي",
      value: formatDeadline(request.deadline),
    });
  }

  return (
    <div
      data-ocid="request.confirmation"
      className="animate-scale-in space-y-8"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="size-9" aria-hidden="true" />
        </span>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            تم استلام طلبك بنجاح
          </h2>
          <p className="mx-auto max-w-md text-balance text-sm leading-relaxed text-muted-foreground md:text-base">
            شكرًا لك. سيتواصل معك فريق «اخدمني» عبر رقم الهاتف الذي أدخلته في
            أقرب وقت ممكن.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-secondary/50 p-6 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          الرقم المرجعي للطلب
        </p>
        <p
          dir="ltr"
          data-ocid="request.confirmation.reference"
          className="mt-2 font-mono text-2xl font-bold tracking-wider text-primary md:text-3xl"
        >
          {request.reference}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          احتفظ بهذا الرقم لمتابعة حالة طلبك.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <h3 className="border-b border-border bg-muted/40 px-6 py-3.5 font-display text-base font-semibold text-foreground">
          ملخص الطلب
        </h3>
        <dl className="divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 px-6 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <dt className="text-sm font-medium text-muted-foreground">
                {row.label}
              </dt>
              <dd
                dir={row.ltr ? "ltr" : undefined}
                className="min-w-0 break-words text-sm font-semibold text-foreground sm:text-end"
              >
                {row.value}
              </dd>
            </div>
          ))}
          <div className="flex flex-col gap-1 px-6 py-3.5 sm:flex-row sm:gap-6">
            <dt className="shrink-0 text-sm font-medium text-muted-foreground">
              وصف الطلب
            </dt>
            <dd className="min-w-0 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
              {request.description}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          asChild
          size="lg"
          data-ocid="request.confirmation.home_link"
          className="h-12 rounded-xl px-8 text-base font-semibold transition-smooth hover:-translate-y-0.5 hover:shadow-elevated"
        >
          <Link to="/">
            <Home className="size-4" aria-hidden="true" />
            العودة إلى الرئيسية
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onNewRequest}
          data-ocid="request.confirmation.new_request_button"
          className="h-12 rounded-xl border-input bg-card px-8 text-base font-semibold transition-smooth hover:-translate-y-0.5"
        >
          <Plus className="size-4" aria-hidden="true" />
          إرسال طلب آخر
        </Button>
      </div>
    </div>
  );
}
