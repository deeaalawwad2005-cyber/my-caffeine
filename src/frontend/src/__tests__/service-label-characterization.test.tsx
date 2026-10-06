import { RequestStatus, ServiceType } from "@/backend";
import { ServicesSection } from "@/components/home/ServicesSection";
import { RequestForm } from "@/components/request/RequestForm";
import {
  PRICE_RANGE_NOTICE,
  SERVICE_TYPES,
  serviceTypeLabel,
} from "@/lib/service-types";
import {
  createMockActor,
  makeRequest,
  renderWithProviders,
} from "@/test/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Characterization baseline for the academic-service presentation layer.
 *
 * The accepted request renames the Arabic label for `ServiceType.homework`
 * from "حل الواجبات" to "تدقيق الواجبات". These tests protect the surrounding
 * behavior that the rename must leave intact: the enum-to-label mapping, the
 * other five labels, the shared price-range notice, and the request-submission
 * journey that selects a service by its rendered option. The new label itself
 * is pinned explicitly below.
 */

const mockActor = createMockActor();

vi.mock("@/hooks/use-backend", () => ({
  useBackend: () => ({ actor: mockActor, isFetching: false }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

/** The label the app currently renders for the homework service. */
function homeworkLabel(): string {
  return serviceTypeLabel(ServiceType.homework);
}

describe("service-type presentation layer", () => {
  it("maps every ServiceType to a non-empty Arabic label", () => {
    for (const service of SERVICE_TYPES) {
      expect(service.label.trim().length).toBeGreaterThan(0);
      expect(serviceTypeLabel(service.value)).toBe(service.label);
    }
  });

  it("uses the accepted homework label and drops the old one", () => {
    expect(serviceTypeLabel(ServiceType.homework)).toBe("تدقيق الواجبات");
    expect(
      SERVICE_TYPES.find((s) => s.value === ServiceType.homework)?.label,
    ).toBe("تدقيق الواجبات");
    expect(serviceTypeLabel(ServiceType.homework)).not.toBe("حل الواجبات");
  });

  it("keeps the five non-homework labels unchanged", () => {
    expect(serviceTypeLabel(ServiceType.presentation)).toBe("العروض التقديمية");
    expect(serviceTypeLabel(ServiceType.research)).toBe("الأبحاث والتقارير");
    expect(serviceTypeLabel(ServiceType.translation)).toBe("الترجمة");
    expect(serviceTypeLabel(ServiceType.programming)).toBe("المشاريع البرمجية");
    expect(serviceTypeLabel(ServiceType.other)).toBe("خدمة أخرى");
  });

  it("keeps the shared price-range notice stable", () => {
    expect(PRICE_RANGE_NOTICE).toBe(
      "الأسعار تبدأ من 2 دينار وتصل إلى 6 دنانير كحد أقصى.",
    );
  });
});

describe("services section rendering", () => {
  it("renders every service label from the presentation layer", () => {
    renderWithProviders(<ServicesSection />);

    const section = screen.getByTestId("home.services.section");
    for (const service of SERVICE_TYPES) {
      expect(within(section).getByText(service.label)).toBeInTheDocument();
    }
  });

  it("renders the homework service card with its current label", () => {
    renderWithProviders(<ServicesSection />);

    const section = screen.getByTestId("home.services.section");
    expect(within(section).getByText(homeworkLabel())).toBeInTheDocument();
  });
});

describe("request submission journey", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActor.submitRequest.mockResolvedValue(
      makeRequest({
        reference: "AKH-000123",
        serviceType: ServiceType.homework,
        fullName: "محمد عبدالله",
        phone: "0501234567",
        description: "حل واجب الرياضيات الفصل الأول",
      }),
    );
  });

  it("submits a homework request selected by its rendered label", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderWithProviders(<RequestForm onSubmitted={onSubmitted} />);

    await user.click(screen.getByTestId("request.service_type.select"));
    await user.click(
      await screen.findByRole("option", { name: homeworkLabel() }),
    );
    await user.type(
      screen.getByTestId("request.description.textarea"),
      "حل واجب الرياضيات الفصل الأول",
    );
    await user.type(
      screen.getByTestId("request.full_name.input"),
      "محمد عبدالله",
    );
    await user.type(screen.getByTestId("request.phone.input"), "0501234567");
    await user.click(screen.getByTestId("request.submit_button"));

    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(mockActor.submitRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceType: ServiceType.homework,
        fullName: "محمد عبدالله",
        phone: "0501234567",
      }),
    );
    expect(onSubmitted.mock.calls[0][0].status).toBe(RequestStatus.new);
  });

  it("still validates an incomplete form without submitting", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderWithProviders(<RequestForm onSubmitted={onSubmitted} />);

    await user.click(screen.getByTestId("request.submit_button"));

    expect(
      await screen.findByText("الرجاء اختيار نوع الخدمة."),
    ).toBeInTheDocument();
    expect(mockActor.submitRequest).not.toHaveBeenCalled();
    expect(onSubmitted).not.toHaveBeenCalled();
  });
});
