import { RequestStatus, ServiceType } from "@/backend";
import type { ServiceRequest } from "@/lib/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";

/**
 * Local typed actor mock. It implements only the methods the frontend calls,
 * so a test that reaches an unimplemented method fails loudly instead of
 * silently passing.
 */
export interface MockActor {
  submitRequest: ReturnType<typeof vi.fn>;
  listRequests: ReturnType<typeof vi.fn>;
  getRequest: ReturnType<typeof vi.fn>;
  updateRequestStatus: ReturnType<typeof vi.fn>;
  getNotificationEmail: ReturnType<typeof vi.fn>;
  setNotificationEmail: ReturnType<typeof vi.fn>;
}

export function createMockActor(overrides: Partial<MockActor> = {}): MockActor {
  return {
    submitRequest: vi.fn(),
    listRequests: vi.fn().mockResolvedValue([]),
    getRequest: vi.fn().mockResolvedValue(null),
    updateRequestStatus: vi.fn(),
    getNotificationEmail: vi.fn().mockResolvedValue(""),
    setNotificationEmail: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

export function makeRequest(
  overrides: Partial<ServiceRequest> = {},
): ServiceRequest {
  return {
    id: 1n,
    reference: "AKH-000001",
    serviceType: ServiceType.homework,
    description: "حل واجب الرياضيات الفصل الأول",
    fullName: "محمد عبدالله",
    phone: "0501234567",
    createdAt: 1_700_000_000_000_000_000n,
    status: RequestStatus.new,
    ...overrides,
  };
}

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
): ReturnType<typeof render> {
  const queryClient = createTestQueryClient();
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(ui, { wrapper: Wrapper });
}
