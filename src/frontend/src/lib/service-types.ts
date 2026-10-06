import { RequestStatus, ServiceType } from "@/backend";

/**
 * Arabic presentation layer for the backend's `ServiceType` and
 * `RequestStatus` enums. The backend enums are value imports (not types) so
 * they can be used as object keys and in `switch` statements.
 */

export interface ServiceTypeMeta {
  value: ServiceType;
  label: string;
  description: string;
}

/**
 * Shared price-range notice. The site charges a general range rather than a
 * per-service price, so this single string is reused everywhere the range is
 * shown (request form, services grid, how-it-works, FAQ).
 */
export const PRICE_RANGE_NOTICE =
  "الأسعار تبدأ من 2 دينار وتصل إلى 6 دنانير كحد أقصى.";

export const SERVICE_TYPES: ServiceTypeMeta[] = [
  {
    value: ServiceType.homework,
    label: "تدقيق الواجبات",
    description: "تدقيق الواجبات الأكاديمية ومراجعتها.",
  },
  {
    value: ServiceType.presentation,
    label: "العروض التقديمية",
    description: "تصميم عروض تقديمية احترافية جاهزة للعرض.",
  },
  {
    value: ServiceType.research,
    label: "الأبحاث والتقارير",
    description: "إعداد الأبحاث والتقارير الأكاديمية بالمراجع.",
  },
  {
    value: ServiceType.translation,
    label: "الترجمة",
    description: "ترجمة النصوص والمستندات بين العربية والإنجليزية.",
  },
  {
    value: ServiceType.programming,
    label: "المشاريع البرمجية",
    description: "تنفيذ المشاريع البرمجية والواجبات العملية.",
  },
  {
    value: ServiceType.other,
    label: "خدمة أخرى",
    description: "أي خدمة أكاديمية أخرى تحتاجها.",
  },
];

const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.homework]: "تدقيق الواجبات",
  [ServiceType.presentation]: "العروض التقديمية",
  [ServiceType.research]: "الأبحاث والتقارير",
  [ServiceType.translation]: "الترجمة",
  [ServiceType.programming]: "المشاريع البرمجية",
  [ServiceType.other]: "خدمة أخرى",
};

export function serviceTypeLabel(type: ServiceType): string {
  return SERVICE_TYPE_LABELS[type] ?? "خدمة أخرى";
}

export interface RequestStatusMeta {
  value: RequestStatus;
  label: string;
  badgeClass: string;
}

export const REQUEST_STATUSES: RequestStatusMeta[] = [
  { value: RequestStatus.new, label: "جديد", badgeClass: "badge-new" },
  {
    value: RequestStatus.inProgress,
    label: "قيد التنفيذ",
    badgeClass: "badge-progress",
  },
  { value: RequestStatus.completed, label: "مكتمل", badgeClass: "badge-done" },
  {
    value: RequestStatus.cancelled,
    label: "ملغي",
    badgeClass: "badge-cancelled",
  },
];

const STATUS_META: Record<RequestStatus, RequestStatusMeta> = {
  [RequestStatus.new]: REQUEST_STATUSES[0],
  [RequestStatus.inProgress]: REQUEST_STATUSES[1],
  [RequestStatus.completed]: REQUEST_STATUSES[2],
  [RequestStatus.cancelled]: REQUEST_STATUSES[3],
};

export function requestStatusLabel(status: RequestStatus): string {
  return STATUS_META[status]?.label ?? "غير معروف";
}

export function requestStatusBadgeClass(status: RequestStatus): string {
  return STATUS_META[status]?.badgeClass ?? "badge-new";
}
