import type { ServiceType } from "@/backend";
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
import type { RequestStatus } from "@/lib/backend";
import { REQUEST_STATUSES, SERVICE_TYPES } from "@/lib/service-types";
import { Search, X } from "lucide-react";

const ALL_VALUE = "all";

export interface RequestFilterState {
  search: string;
  status: RequestStatus | "all";
  serviceType: ServiceType | "all";
}

interface RequestFiltersProps {
  value: RequestFilterState;
  onChange: (next: RequestFilterState) => void;
  onReset: () => void;
  resultCount: number;
  isFetching: boolean;
}

export function RequestFilters({
  value,
  onChange,
  onReset,
  resultCount,
  isFetching,
}: RequestFiltersProps) {
  const hasActiveFilters =
    value.search.trim() !== "" ||
    value.status !== "all" ||
    value.serviceType !== "all";

  return (
    <section
      data-ocid="admin.filters.panel"
      aria-label="تصفية الطلبات"
      className="rounded-xl border border-border bg-card p-4 shadow-subtle sm:p-5"
    >
      <div className="grid gap-4 md:grid-cols-[1.6fr_1fr_1fr_auto] md:items-end">
        <div className="space-y-2">
          <Label htmlFor="admin-search">بحث</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="admin-search"
              type="search"
              inputMode="search"
              value={value.search}
              onChange={(event) =>
                onChange({ ...value, search: event.target.value })
              }
              placeholder="ابحث بالاسم أو الرقم المرجعي أو الهاتف"
              data-ocid="admin.filters.search_input"
              className="pe-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-status-filter">الحالة</Label>
          <Select
            value={value.status}
            onValueChange={(next) =>
              onChange({ ...value, status: next as RequestStatus | "all" })
            }
          >
            <SelectTrigger
              id="admin-status-filter"
              data-ocid="admin.filters.status_select"
              className="w-full"
            >
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>كل الحالات</SelectItem>
              {REQUEST_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-service-filter">نوع الخدمة</Label>
          <Select
            value={value.serviceType}
            onValueChange={(next) =>
              onChange({ ...value, serviceType: next as ServiceType | "all" })
            }
          >
            <SelectTrigger
              id="admin-service-filter"
              data-ocid="admin.filters.service_select"
              className="w-full"
            >
              <SelectValue placeholder="كل الخدمات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>كل الخدمات</SelectItem>
              {SERVICE_TYPES.map((service) => (
                <SelectItem key={service.value} value={service.value}>
                  {service.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          disabled={!hasActiveFilters}
          data-ocid="admin.filters.reset_button"
          className="md:mb-0"
        >
          <X className="size-4" aria-hidden="true" />
          إعادة الضبط
        </Button>
      </div>

      <p
        data-ocid="admin.filters.result_count"
        aria-live="polite"
        className="mt-4 text-sm text-muted-foreground"
      >
        {isFetching
          ? "جارٍ تحديث النتائج…"
          : `عدد الطلبات المعروضة: ${resultCount}`}
      </p>
    </section>
  );
}
