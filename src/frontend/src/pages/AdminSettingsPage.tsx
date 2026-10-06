import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useBackend } from "@/hooks/use-backend";
import { getNotificationEmail, setNotificationEmail } from "@/lib/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, Lock, LogIn, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdminSettingsPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, login } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["admin", "notification-email"],
    queryFn: async () => {
      if (!actor) return "";
      return getNotificationEmail(actor);
    },
    enabled: isAuthenticated && !!actor && !isFetching,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      setEmail(query.data);
    }
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: async (value: string) => {
      if (!actor) throw new Error("الخادم غير جاهز");
      return setNotificationEmail(actor, value);
    },
    onSuccess: () => {
      toast.success("تم حفظ بريد الإشعارات بنجاح");
      void queryClient.invalidateQueries({
        queryKey: ["admin", "notification-email"],
      });
    },
    onError: () => {
      toast.error("تعذّر حفظ البريد. حاول مرة أخرى.");
    },
  });

  if (isInitializing) {
    return (
      <div
        data-ocid="admin.settings.auth.loading_state"
        className="container flex min-h-[60vh] items-center justify-center py-16"
      >
        <p className="text-sm text-muted-foreground">جارٍ التحقق من الجلسة…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="admin.settings.auth.panel"
        className="container flex min-h-[70vh] items-center justify-center py-16"
      >
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-subtle">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Lock className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
            إعدادات الإشعارات
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            يرجى تسجيل الدخول للوصول إلى إعدادات الإشعارات.
          </p>
          <Button
            type="button"
            size="lg"
            className="mt-6 w-full rounded-full"
            disabled={isLoggingIn}
            data-ocid="admin.settings.auth.login_button"
            onClick={() => login()}
          >
            <LogIn className="size-4" aria-hidden="true" />
            {isLoggingIn ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setValidationError("يرجى إدخال بريد إلكتروني صحيح.");
      return;
    }
    setValidationError(null);
    mutation.mutate(trimmed);
  };

  return (
    <div
      data-ocid="admin.settings.page"
      className="container max-w-2xl space-y-6 py-8 md:py-12"
    >
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ms-2 mb-2"
          data-ocid="admin.settings.back_button"
        >
          <Link to="/admin">
            <ArrowRight className="size-4" aria-hidden="true" />
            العودة إلى الطلبات
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-subtle">
            <BellRing className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              إعدادات الإشعارات
            </h1>
            <p className="text-sm text-muted-foreground">
              حدّد البريد الذي تصلك عليه إشعارات الطلبات الجديدة.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        data-ocid="admin.settings.form"
        className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-subtle"
      >
        {query.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="notification-email">بريد استقبال الإشعارات</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="notification-email"
                type="email"
                dir="ltr"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="name@example.com"
                aria-invalid={validationError !== null}
                aria-describedby={
                  validationError ? "notification-email-error" : undefined
                }
                data-ocid="admin.settings.email_input"
                className="pe-9 text-start"
              />
            </div>
            {validationError ? (
              <p
                id="notification-email-error"
                data-ocid="admin.settings.email_error"
                className="text-sm text-destructive"
              >
                {validationError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                سيتم إرسال إشعار إلى هذا البريد عند وصول طلب جديد.
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            disabled={mutation.isPending || query.isLoading}
            data-ocid="admin.settings.save_button"
            className="rounded-full sm:w-auto"
          >
            {mutation.isPending ? "جارٍ الحفظ…" : "حفظ البريد"}
          </Button>
          {mutation.isSuccess ? (
            <p
              data-ocid="admin.settings.success_state"
              className="text-sm font-medium text-[oklch(var(--status-done-fg))]"
            >
              تم حفظ الإعدادات.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
