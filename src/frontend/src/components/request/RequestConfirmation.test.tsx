import { ServiceType } from "@/backend";
import { RequestConfirmation } from "@/components/request/RequestConfirmation";
import { makeRequest, renderWithProviders } from "@/test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("RequestConfirmation", () => {
  it("shows the reference number and a summary of the submission", () => {
    renderWithProviders(
      <RequestConfirmation
        request={makeRequest({
          reference: "AKH-000007",
          serviceType: ServiceType.translation,
          fullName: "سارة أحمد",
          phone: "+966501234567",
          description: "ترجمة مستند من العربية إلى الإنجليزية",
        })}
        onNewRequest={vi.fn()}
      />,
    );

    expect(
      screen.getByTestId("request.confirmation.reference"),
    ).toHaveTextContent("AKH-000007");
    expect(screen.getByText("سارة أحمد")).toBeInTheDocument();
    expect(screen.getByText("الترجمة")).toBeInTheDocument();
    expect(
      screen.getByText("ترجمة مستند من العربية إلى الإنجليزية"),
    ).toBeInTheDocument();
  });

  it("lets the user start another request", async () => {
    const onNewRequest = vi.fn();
    renderWithProviders(
      <RequestConfirmation
        request={makeRequest()}
        onNewRequest={onNewRequest}
      />,
    );

    screen.getByTestId("request.confirmation.new_request_button").click();
    expect(onNewRequest).toHaveBeenCalledTimes(1);
  });
});
