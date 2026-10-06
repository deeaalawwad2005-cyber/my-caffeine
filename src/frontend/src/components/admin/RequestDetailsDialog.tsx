import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RequestStatus, ServiceRequest } from "@/lib/backend";
import {
  formatDateTime,
  formatDeadline,
  formatPhone,
  phoneHref,
} from "@/lib/format";
import {
  REQUEST_STATUSES,
  requestStatusBadgeClass,
  requestStatusLabel,
  serviceTypeLabel,
} from "@/lib/service-types";
import { cn } from "@/lib/utils";
import { CalendarClock, GraduationCap, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

interface RequestDetailsDialogProps {
  request: ServiceRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: bigint, status: RequestStatus) => void;
  isUpdating: boolean;
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function RequestDetailsDialog({
  request,
  open,
  onOpenChange,
  onStatusChange,
  isUpdating,
}: RequestDetailsDialogProps) {
  const [draftStatus, setDraftStatus] = useState<RequestStatus | null>(null);

  useEffect(() => {
    setDraftStatus(request?.status ?? null);
  }, [request]);

  if (!request) return null;

  const statusChanged = draftStatus !== null && draftStatus !== request.status;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="admin.request_details.dialog"
        className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl"
      >
        <DialogHeader className="text-start">
          <div className="flex flex-wrap items-center gap-3">
            <DialogTitle className="font-display text-xl">
              تفاصيل الطلب
            </DialogTitle>
            <Badge
              className={cn(
                "rounded-full border-transparent px-2.5 py-1",
                requestStatusBadgeClass(request.status),
              )}
            >
              {requestStatusLabel(request.status)}
            </Badge>
          </div>
          <DialogDescription className="font-mono text-xs">
            الرقم المرجعي: {request.reference}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 sm:grid-cols-2">
          <DetailRow
            icon={<User className="size-4" aria-hidden="true" />}
            label="الاسم الكامل"
          >
            {request.fullName}
          </DetailRow>

          <DetailRow
            icon={<Phone className="size-4" aria-hidden="true" />}
            label="رقم الهاتف"
          >
            <a
              href={phoneHref(request.phone)}
              dir="ltr"
              className="text-primary transition-smooth hover:underline"
            >
              {formatPhone(request.phone)}
            </a>
          </DetailRow>

          <DetailRow
            icon={<Mail className="size-4" aria-hidden="true" />}
            label="البريد الإلكتروني"
          >
            {request.email ? (
              <a
                href={`mailto:${request.email}`}
                dir="ltr"
                className="text-primary transition-smooth hover:underline"
              >
                {request.email}
              </a>
            ) : (
              <span className="text-muted-foreground">غير مُدخل</span>
            )}
          </DetailRow>

          <DetailRow
            icon={<GraduationCap className="size-4" aria-hidden="true" />}
            label="الجامعة / الجهة"
          >
            {request.university ?? (
              <span className="text-muted-foreground">غير مُدخل</span>
            )}
          </DetailRow>

          <DetailRow
            icon={<CalendarClock className="size-4" aria-hidden="true" />}
            label="الموعد النهائي"
          >
            {formatDeadline(request.deadline)}
          </DetailRow>

          <DetailRow
            icon={<CalendarClock className="size-4" aria-hidden="true" />}
            label="تاريخ الطلب"
          >
            {formatDateTime(request.createdAt)}
          </DetailRow>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            نوع الخدمة
          </p>
          <p className="text-sm font-medium text-foreground">
            {serviceTypeLabel(request.serviceType)}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">وصف الطلب</p>
          <p className="whitespace-pre-wrap break-words rounded-lg border border-border bg-secondary/40 p-4 text-sm leading-relaxed text-foreground">
            {request.description}
          </p>
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
          <Label htmlFor="admin-status-change">تغيير حالة الطلب</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={draftStatus ?? request.status}
              onValueChange={(next) => setDraftStatus(next as RequestStatus)}
            >
              <SelectTrigger
                id="admin-status-change"
                data-ocid="admin.request_details.status_select"
                className="w-full sm:w-56"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REQUEST_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              disabled={!statusChanged || isUpdating}
              data-ocid="admin.request_details.save_button"
              onClick={() => {
                if (draftStatus) onStatusChange(request.id, draftStatus);
              }}
            >
              {isUpdating ? "جارٍ الحفظ…" : "حفظ الحالة"}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="admin.request_details.close_button"
          >
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
