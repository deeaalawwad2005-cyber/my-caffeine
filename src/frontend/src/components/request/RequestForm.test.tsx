import { RequestStatus, ServiceType } from "@/backend";
import { RequestForm } from "@/components/request/RequestForm";
import type { ServiceRequest } from "@/lib/backend";
import { PRICE_RANGE_NOTICE } from "@/lib/service-types";
import {
  createMockActor,
  makeRequest,
  renderWithProviders,
} from "@/test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockActor = createMockActor();

vi.mock("@/hooks/use-backend", () => ({
  useBackend: () => ({ actor: mockActor, isFetching: false }),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

async function selectServiceType(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId("request.service_type.select"));
  await user.click(
    await screen.findByRole("option", { name: "تدقيق الواجبات" }),
  );
}

describe("RequestForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActor.submitRequest.mockResolvedValue(
      makeRequest({ reference: "AKH-000042" }),
    );
  });

  it("shows the price range next to the service-type selection", () => {
    renderWithProviders(<RequestForm onSubmitted={vi.fn()} />);

    expect(screen.getByTestId("request.price_range.notice")).toHaveTextContent(
      PRICE_RANGE_NOTICE,
    );
  });

  it("submits a valid request and reports the created request", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderWithProviders(<RequestForm onSubmitted={onSubmitted} />);

    await selectServiceType(user);
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
        description: "حل واجب الرياضيات الفصل الأول",
      }),
    );
    const created = onSubmitted.mock.calls[0][0] as ServiceRequest;
    expect(created.reference).toBe("AKH-000042");
    expect(created.status).toBe(RequestStatus.new);
  });

  it("shows Arabic validation errors and does not submit an incomplete form", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderWithProviders(<RequestForm onSubmitted={onSubmitted} />);

    await user.click(screen.getByTestId("request.submit_button"));

    expect(
      await screen.findByText("الرجاء اختيار نوع الخدمة."),
    ).toBeInTheDocument();
    expect(screen.getByText("الاسم الكامل مطلوب.")).toBeInTheDocument();
    expect(screen.getByText("وصف الطلب مطلوب.")).toBeInTheDocument();
    expect(screen.getByText("رقم الهاتف مطلوب للتواصل.")).toBeInTheDocument();
    expect(mockActor.submitRequest).not.toHaveBeenCalled();
    expect(onSubmitted).not.toHaveBeenCalled();
  });

  it("rejects a malformed phone number", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    renderWithProviders(<RequestForm onSubmitted={onSubmitted} />);

    await selectServiceType(user);
    await user.type(
      screen.getByTestId("request.description.textarea"),
      "حل واجب الرياضيات الفصل الأول",
    );
    await user.type(
      screen.getByTestId("request.full_name.input"),
      "محمد عبدالله",
    );
    await user.type(screen.getByTestId("request.phone.input"), "abc");
    await user.click(screen.getByTestId("request.submit_button"));

    expect(await screen.findByText(/رقم الهاتف غير صحيح/)).toBeInTheDocument();
    expect(mockActor.submitRequest).not.toHaveBeenCalled();
  });

  it("surfaces a backend failure without reporting success", async () => {
    const user = userEvent.setup();
    const onSubmitted = vi.fn();
    mockActor.submitRequest.mockRejectedValueOnce(new Error("تعذّر الاتصال"));
    renderWithProviders(<RequestForm onSubmitted={onSubmitted} />);

    await selectServiceType(user);
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

    expect(await screen.findByRole("alert")).toHaveTextContent("تعذّر الاتصال");
    expect(onSubmitted).not.toHaveBeenCalled();
  });
});
