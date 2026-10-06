import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/use-backend";
import { submitRequest } from "@/lib/backend";
import type { ServiceRequest, SubmitRequestInput } from "@/lib/backend";
import { PRICE_RANGE_NOTICE, SERVICE_TYPES } from "@/lib/service-types";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, BadgeDollarSign, Loader2, Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

interface RequestFormProps {
  onSubmitted: (request: ServiceRequest) => void;
}

interface FormState {
  serviceType: string;
  description: string;
  fullName: string;
  phone: string;
  email: string;
  university: string;
  deadline: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  serviceType: "",
  description: "",
  fullName: "",
  phone: "",
  email: "",
  university: "",
  deadline: "",
};

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.serviceType) {
    errors.serviceType = "الرجاء اختيار نوع الخدمة.";
  }
  if (!form.fullName.trim()) {
    errors.fullName = "الاسم الكامل مطلوب.";
  } else if (form.fullName.trim().length < 3) {
    errors.fullName = "الرجاء إدخال الاسم الكامل (٣ أحرف على الأقل).";
  }
  if (!form.description.trim()) {
    errors.description = "وصف الطلب مطلوب.";
  } else if (form.description.trim().length < 10) {
    errors.description = "الرجاء كتابة وصف أوضح للطلب (١٠ أحرف على الأقل).";
  }
  if (!form.phone.trim()) {
    errors.phone = "رقم الهاتف مطلوب للتواصل.";
  } else if (!PHONE_PATTERN.test(form.phone.trim())) {
    errors.phone = "رقم الهاتف غير صحيح. مثال: 0501234567 أو +966501234567";
  }
  if (form.email.trim() && !EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = "البريد الإلكتروني غير صحيح.";
  }

  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      data-ocid="request.form.error"
      className="flex items-center gap-1.5 text-sm font-medium text-destructive"
    >
      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

export function RequestForm({ onSubmitted }: RequestFormProps) {
  const { actor } = useBackend();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (input: SubmitRequestInput) => {
      if (!actor)
        throw new Error("الخدمة غير جاهزة بعد. حاول مرة أخرى بعد لحظات.");
      return submitRequest(actor, input);
    },
    onSuccess: (request) => {
      setForm(INITIAL_FORM);
      setErrors({});
      setSubmitError(null);
      onSubmitted(request);
    },
    onError: (error: unknown) => {
      setSubmitError(
        error instanceof Error && error.message
          ? error.message
          : "تعذّر إرسال الطلب. الرجاء المحاولة مرة أخرى.",
      );
    },
  });

  const update =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    setSubmitError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const input: SubmitRequestInput = {
      serviceType: form.serviceType as SubmitRequestInput["serviceType"],
      description: form.description.trim(),
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      university: form.university.trim() || undefined,
      deadline: form.deadline || undefined,
    };

    mutation.mutate(input);
  };

  const isPending = mutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-ocid="request.form"
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="serviceType" className="text-sm font-semibold">
          نوع الخدمة <span className="text-destructive">*</span>
        </Label>
        <Select
          value={form.serviceType}
          onValueChange={(value) => {
            setForm((current) => ({ ...current, serviceType: value }));
            setErrors((current) => ({ ...current, serviceType: undefined }));
          }}
        >
          <SelectTrigger
            id="serviceType"
            data-ocid="request.service_type.select"
            aria-invalid={Boolean(errors.serviceType)}
            aria-describedby={
              errors.serviceType ? "serviceType-error" : undefined
            }
            className="h-11 w-full rounded-xl bg-card"
          >
            <SelectValue placeholder="اختر نوع الخدمة المطلوبة" />
          </SelectTrigger>
          <SelectContent>
            {SERVICE_TYPES.map((service) => (
              <SelectItem key={service.value} value={service.value}>
                {service.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError id="serviceType-error" message={errors.serviceType} />
        <div
          data-ocid="request.price_range.notice"
          className="flex items-start gap-2.5 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm leading-relaxed text-foreground"
        >
          <BadgeDollarSign
            className="mt-0.5 size-4 shrink-0 text-accent"
            aria-hidden="true"
          />
          <p>
            <span className="font-semibold">نطاق الأسعار: </span>
            {PRICE_RANGE_NOTICE}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold">
          وصف تفصيلي للطلب <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          data-ocid="request.description.textarea"
          value={form.description}
          onChange={update("description")}
          placeholder="اشرح تفاصيل المطلوب: المادة، عدد الصفحات، المتطلبات الخاصة…"
          rows={5}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          className="min-h-32 rounded-xl bg-card"
        />
        <FieldError id="description-error" message={errors.description} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-semibold">
            الاسم الكامل <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            data-ocid="request.full_name.input"
            value={form.fullName}
            onChange={update("fullName")}
            placeholder="مثال: محمد عبدالله"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className="h-11 rounded-xl bg-card"
          />
          <FieldError id="fullName-error" message={errors.fullName} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold">
            رقم الهاتف للتواصل <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            dir="ltr"
            data-ocid="request.phone.input"
            value={form.phone}
            onChange={update("phone")}
            placeholder="+966 50 123 4567"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className="h-11 rounded-xl bg-card text-start"
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">
            البريد الإلكتروني{" "}
            <span className="font-normal text-muted-foreground">(اختياري)</span>
          </Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            data-ocid="request.email.input"
            value={form.email}
            onChange={update("email")}
            placeholder="name@example.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-11 rounded-xl bg-card text-start"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="university" className="text-sm font-semibold">
            اسم الجامعة / التخصص{" "}
            <span className="font-normal text-muted-foreground">(اختياري)</span>
          </Label>
          <Input
            id="university"
            data-ocid="request.university.input"
            value={form.university}
            onChange={update("university")}
            placeholder="مثال: جامعة الملك سعود — هندسة"
            className="h-11 rounded-xl bg-card"
          />
        </div>
      </div>

      <div className="space-y-2 sm:max-w-xs">
        <Label htmlFor="deadline" className="text-sm font-semibold">
          الموعد النهائي المطلوب{" "}
          <span className="font-normal text-muted-foreground">(اختياري)</span>
        </Label>
        <Input
          id="deadline"
          type="date"
          data-ocid="request.deadline.input"
          value={form.deadline}
          onChange={update("deadline")}
          className="h-11 rounded-xl bg-card"
        />
      </div>

      {submitError ? (
        <div
          data-ocid="request.form.error_state"
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          الحقول المعلّمة بـ <span className="text-destructive">*</span> مطلوبة.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          data-ocid="request.submit_button"
          className={cn(
            "h-12 w-full rounded-xl px-8 text-base font-semibold sm:w-auto",
            "transition-smooth hover:-translate-y-0.5 hover:shadow-elevated",
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              جارٍ الإرسال…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden="true" />
              تأكيد الطلب
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
