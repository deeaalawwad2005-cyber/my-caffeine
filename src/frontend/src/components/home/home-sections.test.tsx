import { FaqSection } from "@/components/home/FaqSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PRICE_RANGE_NOTICE } from "@/lib/service-types";
import { renderWithProviders } from "@/test/test-utils";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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

describe("home page sections", () => {
  it("renders the brand name, hero description and request CTA", () => {
    renderWithProviders(<HeroSection />);

    expect(
      screen.getByRole("heading", { level: 1, name: "اخدمني" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /اطلب خدمة الآن/ }),
    ).toHaveAttribute("href", "/request");
    // The accepted rename reaches the hero description.
    expect(
      screen.getByText(/تدقيق الواجبات، والعروض التقديمية/),
    ).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent("حل الواجبات");
  });

  it("renders every academic service as a card", () => {
    renderWithProviders(<ServicesSection />);

    const section = screen.getByTestId("home.services.section");
    for (const label of [
      "تدقيق الواجبات",
      "العروض التقديمية",
      "الأبحاث والتقارير",
      "الترجمة",
      "المشاريع البرمجية",
      "خدمة أخرى",
    ]) {
      expect(within(section).getByText(label)).toBeInTheDocument();
    }
  });

  it("shows the price range in the services section", () => {
    renderWithProviders(<ServicesSection />);

    expect(
      within(screen.getByTestId("home.services.section")).getByText(
        PRICE_RANGE_NOTICE,
      ),
    ).toBeInTheDocument();
  });

  it("renders the three how-it-works steps", () => {
    renderWithProviders(<HowItWorksSection />);

    const section = screen.getByTestId("home.how_it_works.section");
    expect(within(section).getByText("قدّم الطلب")).toBeInTheDocument();
    expect(within(section).getByText("نتواصل معك")).toBeInTheDocument();
    expect(within(section).getByText("تستلم العمل")).toBeInTheDocument();
  });

  it("shows the price range in the how-it-works steps", () => {
    renderWithProviders(<HowItWorksSection />);

    expect(
      within(screen.getByTestId("home.how_it_works.section")).getByText(
        PRICE_RANGE_NOTICE,
      ),
    ).toBeInTheDocument();
  });

  it("opens and closes a FAQ answer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FaqSection />);

    const question = screen.getByRole("button", {
      name: "كيف أقدّم طلبًا جديدًا؟",
    });
    expect(question).toHaveAttribute("aria-expanded", "false");

    await user.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(/اضغط على زر «اطلب خدمة الآن»/),
    ).toBeInTheDocument();

    await user.click(question);
    expect(question).toHaveAttribute("aria-expanded", "false");
  });

  it("shows the accepted homework label in the services FAQ answer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FaqSection />);

    await user.click(
      screen.getByRole("button", {
        name: "ما أنواع الخدمات الأكاديمية التي تقدمونها؟",
      }),
    );

    expect(screen.getByText(/نقدم تدقيق الواجبات/)).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent("حل الواجبات");
  });

  it("shows the price range in the pricing FAQ answer", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FaqSection />);

    await user.click(
      screen.getByRole("button", { name: "كم تبلغ أسعار الخدمات؟" }),
    );

    expect(
      screen.getByText(new RegExp(PRICE_RANGE_NOTICE)),
    ).toBeInTheDocument();
  });
});
