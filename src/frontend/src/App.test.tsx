import App from "@/App";
import { renderWithProviders } from "@/test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/**
 * The router is created inside `App`, and jsdom's default URL is the site root,
 * so rendering `App` exercises the default route end to end: root route shell
 * (header + footer) plus the home page. This is the "no blank screen on the
 * default path" acceptance criterion.
 */
vi.mock("@/hooks/use-backend", () => ({
  useBackend: () => ({ actor: null, isFetching: false }),
  useAuth: () => ({
    isAuthenticated: false,
    isInitializing: false,
    isLoggingIn: false,
    login: vi.fn(),
  }),
}));

describe("App default route", () => {
  it("renders the home page inside the site shell instead of a blank screen", async () => {
    renderWithProviders(<App />);

    // Home page content.
    expect(
      await screen.findByRole("heading", { level: 1, name: "اخدمني" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("home.services.section")).toBeInTheDocument();

    // Site shell wraps the route.
    expect(screen.getByTestId("site.header")).toBeInTheDocument();
    expect(screen.getByTestId("site.footer")).toBeInTheDocument();
  });
});
