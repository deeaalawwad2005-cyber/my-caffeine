import { ServiceType } from "@/backend";
import { RequestPage } from "@/pages/RequestPage";
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

describe("RequestPage", () => {
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

  it("shows a WhatsApp button that opens the owner's number on wa.me", () => {
    renderWithProviders(<RequestPage />);

    const whatsapp = screen.getByTestId("request.whatsapp_button");
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/964781389411");
    expect(whatsapp).toHaveAttribute("target", "_blank");
    expect(screen.getByTestId("request.phone_link")).toHaveAttribute(
      "href",
      "tel:0781389411",
    );
  });

  it("shows the owner's number and no stale contact details", () => {
    renderWithProviders(<RequestPage />);

    expect(screen.getByTestId("request.phone_link")).toHaveTextContent(
      "0781389411",
    );
    // No placeholder or legacy contact details from earlier revisions.
    expect(document.body).not.toHaveTextContent("owner@akhdemni.com");
    expect(document.body).not.toHaveTextContent("+966");
  });

  it("shows the confirmation with the reference number after a successful submission", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    // The form is shown first.
    expect(screen.getByTestId("request.form")).toBeInTheDocument();

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

    // The page swaps the form for the confirmation and surfaces the reference.
    await waitFor(() =>
      expect(
        screen.getByTestId("request.confirmation.reference"),
      ).toHaveTextContent("AKH-000123"),
    );
    expect(screen.queryByTestId("request.form")).not.toBeInTheDocument();
    expect(mockActor.submitRequest).toHaveBeenCalledTimes(1);
  });

  it("returns to a fresh form when the user starts another request", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

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

    await screen.findByTestId("request.confirmation.reference");
    await user.click(
      screen.getByTestId("request.confirmation.new_request_button"),
    );

    expect(await screen.findByTestId("request.form")).toBeInTheDocument();
    expect(
      screen.queryByTestId("request.confirmation.reference"),
    ).not.toBeInTheDocument();
  });
});
