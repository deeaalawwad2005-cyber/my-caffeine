import { RequestStatus, ServiceType } from "@/backend";
import { AdminPage } from "@/pages/AdminPage";
import {
  createMockActor,
  makeRequest,
  renderWithProviders,
} from "@/test/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
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

describe("AdminPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authState.isAuthenticated = false;
    authState.isInitializing = false;
    authState.isLoggingIn = false;
    mockActor.listRequests.mockResolvedValue([]);
  });

  it("blocks the admin area when not authenticated", () => {
    renderWithProviders(<AdminPage />);

    expect(screen.getByTestId("admin.auth.panel")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /تسجيل الدخول/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("admin.requests.table"),
    ).not.toBeInTheDocument();
    expect(mockActor.listRequests).not.toHaveBeenCalled();
  });

  it("shows the login button while the session is initializing", () => {
    authState.isInitializing = true;
    renderWithProviders(<AdminPage />);

    expect(screen.getByTestId("admin.auth.loading_state")).toBeInTheDocument();
  });

  it("lists requests with name, phone, service type and status after login", async () => {
    authState.isAuthenticated = true;
    mockActor.listRequests.mockResolvedValue([
      makeRequest({
        id: 1n,
        reference: "AKH-000001",
        fullName: "محمد عبدالله",
        phone: "0501234567",
        serviceType: ServiceType.homework,
        status: RequestStatus.new,
      }),
      makeRequest({
        id: 2n,
        reference: "AKH-000002",
        fullName: "سارة أحمد",
        phone: "+966501234567",
        serviceType: ServiceType.translation,
        status: RequestStatus.completed,
      }),
    ]);

    renderWithProviders(<AdminPage />);

    const table = await screen.findByTestId("admin.requests.table");
    expect(within(table).getByText("محمد عبدالله")).toBeInTheDocument();
    expect(within(table).getByText("سارة أحمد")).toBeInTheDocument();
    expect(within(table).getByText("تدقيق الواجبات")).toBeInTheDocument();
    expect(within(table).getByText("الترجمة")).toBeInTheDocument();
    expect(within(table).getByText("جديد")).toBeInTheDocument();
    expect(within(table).getByText("مكتمل")).toBeInTheDocument();
  });

  it("shows the empty state when there are no requests", async () => {
    authState.isAuthenticated = true;
    renderWithProviders(<AdminPage />);

    expect(
      await screen.findByTestId("admin.requests.empty_state"),
    ).toBeInTheDocument();
  });

  it("re-queries with the selected status filter", async () => {
    authState.isAuthenticated = true;
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await screen.findByTestId("admin.requests.empty_state");
    await user.click(screen.getByTestId("admin.filters.status_select"));
    await user.click(
      await screen.findByRole("option", { name: "قيد التنفيذ" }),
    );

    await waitFor(() =>
      expect(mockActor.listRequests).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: RequestStatus.inProgress }),
      ),
    );
  });

  it("re-queries with the trimmed search term", async () => {
    authState.isAuthenticated = true;
    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await screen.findByTestId("admin.requests.empty_state");
    await user.type(
      screen.getByTestId("admin.filters.search_input"),
      "  محمد  ",
    );

    await waitFor(() =>
      expect(mockActor.listRequests).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "محمد" }),
      ),
    );
  });

  it("changes a request status and persists it through the actor", async () => {
    authState.isAuthenticated = true;
    const request = makeRequest({
      id: 7n,
      reference: "AKH-000007",
      fullName: "محمد عبدالله",
      status: RequestStatus.new,
    });
    mockActor.listRequests.mockResolvedValue([request]);
    mockActor.updateRequestStatus.mockResolvedValue({
      ...request,
      status: RequestStatus.inProgress,
    });

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.click(await screen.findByTestId("admin.requests.open_button.1"));
    const dialog = await screen.findByTestId("admin.request_details.dialog");

    await user.click(
      within(dialog).getByTestId("admin.request_details.status_select"),
    );
    await user.click(
      await screen.findByRole("option", { name: "قيد التنفيذ" }),
    );
    await user.click(
      within(dialog).getByTestId("admin.request_details.save_button"),
    );

    await waitFor(() =>
      expect(mockActor.updateRequestStatus).toHaveBeenCalledWith(
        7n,
        RequestStatus.inProgress,
      ),
    );
  });
});
