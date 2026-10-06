import { HomePage } from "@/pages/HomePage";
import { renderWithProviders } from "@/test/test-utils";
import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

/**
 * The router `Link` is the only external dependency of the composed home page.
 * Stubbing it to an anchor keeps this a component/integration test of the page
 * composition itself: every section is rendered by the real component tree.
 */
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    ...rest
  }: {
    children: React.ReactNode;
    to: string;
  }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

describe("HomePage composition", () => {
  it("renders the hero, services, how-it-works and FAQ sections together", () => {
    renderWithProviders(<HomePage />);

    // Hero section.
    expect(screen.getByTestId("home.hero.section")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "اخدمني" }),
    ).toBeInTheDocument();

    // Services section.
    expect(screen.getByTestId("home.services.section")).toBeInTheDocument();

    // How-it-works section.
    expect(screen.getByTestId("home.how_it_works.section")).toBeInTheDocument();

    // FAQ section.
    expect(screen.getByTestId("home.faq.section")).toBeInTheDocument();
  });

  it("renders the closing call to action linking to the request page", () => {
    renderWithProviders(<HomePage />);

    const cta = screen.getByTestId("home.cta.section");
    expect(cta).toBeInTheDocument();
    expect(
      within(cta).getByRole("link", { name: /اطلب خدمة الآن/ }),
    ).toHaveAttribute("href", "/request");
  });
});
