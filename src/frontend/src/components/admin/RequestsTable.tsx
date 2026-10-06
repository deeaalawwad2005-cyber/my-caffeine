import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ServiceRequest } from "@/lib/backend";
import { formatDate, formatPhone } from "@/lib/format";
import {
  requestStatusBadgeClass,
  requestStatusLabel,
  serviceTypeLabel,
} from "@/lib/service-types";
import { cn } from "@/lib/utils";
import { Inbox, SearchX } from "lucide-react";

interface RequestsTableProps {
  requests: ServiceRequest[];
  isLoading: boolean;
  isError: boolean;
  hasActiveFilters: boolean;
  onOpenRequest: (request: ServiceRequest) => void;
  onRetry: () => void;
}

const SKELETON_IDS = Array.from(
  { length: 5 },
  (_, i) => `request-skeleton-${i}`,
);

export function RequestsTable({
  requests,
  isLoading,
  isError,
  hasActiveFilters,
  onOpenRequest,
  onRetry,
}: RequestsTableProps) {
  if (isLoading) {
    return (
      <div
        data-ocid="admin.requests.loading_state"
        className="overflow-hidden rounded-xl border border-border bg-card shadow-subtle"
      >
        <div className="border-b border-border bg-secondary/50 px-4 py-3">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="divide-y divide-border">
          {SKELETON_IDS.map((id) => (
            <div key={id} className="flex items-center gap-4 px-4 py-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ms-auto h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        data-ocid="admin.requests.error_state"
        className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <SearchX className="size-6" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold text-foreground">
            تعذّر تحميل الطلبات
          </h3>
          <p className="text-sm text-muted-foreground">
            حدث خطأ أثناء جلب الطلبات من الخادم. حاول مرة أخرى.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          data-ocid="admin.requests.retry_button"
        >
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div
        data-ocid="admin.requests.empty_state"
        className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <Inbox className="size-7" aria-hidden="true" />
        </span>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {hasActiveFilters ? "لا توجد نتائج مطابقة" : "لا توجد طلبات بعد"}
          </h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            {hasActiveFilters
              ? "جرّب تعديل كلمات البحث أو إعادة ضبط عوامل التصفية لعرض المزيد من الطلبات."
              : "ستظهر هنا الطلبات الجديدة فور وصولها من العملاء."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid="admin.requests.table"
      className="overflow-hidden rounded-xl border border-border bg-card shadow-subtle"
    >
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-secondary/70 backdrop-blur">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start font-semibold text-foreground">
              الرقم المرجعي
            </TableHead>
            <TableHead className="text-start font-semibold text-foreground">
              الاسم
            </TableHead>
            <TableHead className="text-start font-semibold text-foreground">
              الهاتف
            </TableHead>
            <TableHead className="text-start font-semibold text-foreground">
              نوع الخدمة
            </TableHead>
            <TableHead className="text-start font-semibold text-foreground">
              التاريخ
            </TableHead>
            <TableHead className="text-start font-semibold text-foreground">
              الحالة
            </TableHead>
            <TableHead className="text-end font-semibold text-foreground">
              <span className="sr-only">إجراءات</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <TableRow
              key={request.id.toString()}
              data-ocid={`admin.requests.row.${index + 1}`}
              className="cursor-pointer transition-smooth hover:bg-secondary/60"
              onClick={() => onOpenRequest(request)}
            >
              <TableCell className="font-mono text-xs text-muted-foreground">
                {request.reference}
              </TableCell>
              <TableCell className="max-w-[12rem] truncate font-medium text-foreground">
                {request.fullName}
              </TableCell>
              <TableCell className="text-muted-foreground" dir="ltr">
                {formatPhone(request.phone)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {serviceTypeLabel(request.serviceType)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(request.createdAt)}
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "rounded-full border-transparent px-2.5 py-1",
                    requestStatusBadgeClass(request.status),
                  )}
                >
                  {requestStatusLabel(request.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  data-ocid={`admin.requests.open_button.${index + 1}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenRequest(request);
                  }}
                >
                  التفاصيل
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
