import { AdminSettingsPage } from "@/pages/AdminSettingsPage";
import { createMockActor, renderWithProviders } from "@/test/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockActor = createMockActor();
const authState = {
  isAuthenticated: false,
  isInitializing: false,
  isLoggingIn: false,
  login: vi.fn(),
};

vi.mock("@/hooks/use-backend", () => ({
  useBackend: () => ({ actor: mockActor, isFetching: false }),
  useAuth: () => authState,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

describe("AdminSettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.isAuthenticated = false;
    authState.isInitializing = false;
    authState.isLoggingIn = false;
    mockActor.getNotificationEmail.mockResolvedValue("");
    mockActor.setNotificationEmail.mockResolvedValue(undefined);
  });

  it("blocks the settings page when not authenticated", () => {
    renderWithProviders(<AdminSettingsPage />);

    expect(screen.getByTestId("admin.settings.auth.panel")).toBeInTheDocument();
    expect(mockActor.getNotificationEmail).not.toHaveBeenCalled();
  });

  it("loads the saved notification email", async () => {
    authState.isAuthenticated = true;
    mockActor.getNotificationEmail.mockResolvedValue("owner@akhdemni.com");

    renderWithProviders(<AdminSettingsPage />);

    await waitFor(() =>
      expect(screen.getByTestId("admin.settings.email_input")).toHaveValue(
        "owner@akhdemni.com",
      ),
    );
  });

  it("rejects an invalid email without saving", async () => {
    authState.isAuthenticated = true;
    const user = userEvent.setup();
    renderWithProviders(<AdminSettingsPage />);

    const input = await screen.findByTestId("admin.settings.email_input");
    await user.clear(input);
    await user.type(input, "not-an-email");
    // The form relies on its own Arabic validation, but the input is
    // `type="email"` and the form is not `noValidate`, so jsdom's native
    // constraint validation would swallow the click. Submit the form directly
    // to exercise the component's handler.
    fireEvent.submit(screen.getByTestId("admin.settings.form"));

    expect(
      await screen.findByTestId("admin.settings.email_error"),
    ).toHaveTextContent("يرجى إدخال بريد إلكتروني صحيح.");
    expect(mockActor.setNotificationEmail).not.toHaveBeenCalled();
  });

  it("saves a valid notification email", async () => {
    authState.isAuthenticated = true;
    const user = userEvent.setup();
    renderWithProviders(<AdminSettingsPage />);

    const input = await screen.findByTestId("admin.settings.email_input");
    await user.clear(input);
    await user.type(input, "owner@akhdemni.com");
    await user.click(screen.getByTestId("admin.settings.save_button"));

    await waitFor(() =>
      expect(mockActor.setNotificationEmail).toHaveBeenCalledWith(
        "owner@akhdemni.com",
      ),
    );
  });
});
