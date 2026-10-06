import { RequestDetailsDialog } from "@/components/admin/RequestDetailsDialog";
import { RequestFilters } from "@/components/admin/RequestFilters";
import type { RequestFilterState } from "@/components/admin/RequestFilters";
import { RequestsTable } from "@/components/admin/RequestsTable";
import { Button } from "@/components/ui/button";
import { useAuth, useBackend } from "@/hooks/use-backend";
import type { RequestStatus, ServiceRequest } from "@/lib/backend";
import { listRequests, updateRequestStatus } from "@/lib/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Lock, LogIn, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const DEFAULT_FILTERS: RequestFilterState = {
  search: "",
  status: "all",
  serviceType: "all",
};

export function AdminPage() {
  const { isAuthenticated, isInitializing, isLoggingIn, login } = useAuth();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<RequestFilterState>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<ServiceRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const query = useQuery({
    queryKey: ["admin", "requests", filters],
    queryFn: async () => {
      if (!actor) return [];
      return listRequests(actor, {
        status: filters.status === "all" ? undefined : filters.status,
        serviceType:
          filters.serviceType === "all" ? undefined : filters.serviceType,
        search: filters.search.trim() || undefined,
      });
    },
    enabled: isAuthenticated && !!actor && !isFetching,
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: RequestStatus;
    }) => {
      if (!actor) throw new Error("الخادم غير جاهز");
      return updateRequestStatus(actor, id, status);
    },
    onSuccess: (updated) => {
      if (updated) {
        setSelected(updated);
      }
      toast.success("تم تحديث حالة الطلب بنجاح");
      void queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
    },
    onError: () => {
      toast.error("تعذّر تحديث حالة الطلب. حاول مرة أخرى.");
    },
  });

  const requests = useMemo(() => query.data ?? [], [query.data]);
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.serviceType !== "all";

  if (isInitializing) {
    return (
      <div
        data-ocid="admin.auth.loading_state"
        className="container flex min-h-[60vh] items-center justify-center py-16"
      >
        <p className="text-sm text-muted-foreground">جارٍ التحقق من الجلسة…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        data-ocid="admin.auth.panel"
        className="container flex min-h-[70vh] items-center justify-center py-16"
      >
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-subtle">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <Lock className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-foreground">
            لوحة الإدارة
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            هذه المنطقة مخصّصة لإدارة الطلبات. يرجى تسجيل الدخول للمتابعة.
          </p>
          <Button
            type="button"
            size="lg"
            className="mt-6 w-full rounded-full"
            disabled={isLoggingIn}
            data-ocid="admin.auth.login_button"
            onClick={() => login()}
          >
            <LogIn className="size-4" aria-hidden="true" />
            {isLoggingIn ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            يتم تسجيل الدخول عبر Internet Identity بشكل آمن.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-ocid="admin.page" className="container space-y-6 py-8 md:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-subtle">
            <LayoutDashboard className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              لوحة إدارة الطلبات
            </h1>
            <p className="text-sm text-muted-foreground">
              تابع الطلبات الواردة وحدّث حالتها.
            </p>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          className="rounded-full"
          data-ocid="admin.settings_link"
        >
          <Link to="/admin/settings">
            <Settings className="size-4" aria-hidden="true" />
            إعدادات الإشعارات
          </Link>
        </Button>
      </header>

      <RequestFilters
        value={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        resultCount={requests.length}
        isFetching={query.isFetching}
      />

      <RequestsTable
        requests={requests}
        isLoading={query.isLoading}
        isError={query.isError}
        hasActiveFilters={hasActiveFilters}
        onOpenRequest={(request) => {
          setSelected(request);
          setDialogOpen(true);
        }}
        onRetry={() => {
          void query.refetch();
        }}
      />

      <RequestDetailsDialog
        request={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isUpdating={statusMutation.isPending}
        onStatusChange={(id, status) => {
          statusMutation.mutate({ id, status });
        }}
      />
    </div>
  );
}
