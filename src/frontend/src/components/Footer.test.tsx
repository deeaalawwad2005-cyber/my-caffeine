import { Footer } from "@/components/Footer";
import { renderWithProviders } from "@/test/test-utils";
import { screen } from "@testing-library/react";
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

describe("Footer", () => {
  it("shows a WhatsApp button that opens the owner's number on wa.me", () => {
    renderWithProviders(<Footer />);

    const whatsapp = screen.getByTestId("site.footer_whatsapp");
    expect(whatsapp).toHaveAttribute("href", "https://wa.me/964781389411");
    expect(whatsapp).toHaveAttribute("target", "_blank");
  });

  it("shows the owner's phone and email and no stale contact details", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByTestId("site.footer_phone")).toHaveAttribute(
      "href",
      "tel:0781389411",
    );
    expect(screen.getByTestId("site.footer_email")).toHaveAttribute(
      "href",
      "mailto:deeaalawwad00@gmail.com",
    );

    const footer = screen.getByTestId("site.footer");
    expect(footer).toHaveTextContent("0781389411");
    expect(footer).toHaveTextContent("deeaalawwad00@gmail.com");
    // The accepted rename reaches the footer tagline.
    expect(footer).toHaveTextContent("تدقيق الواجبات");
    expect(footer).not.toHaveTextContent("حل الواجبات");
    // No placeholder or legacy contact details from earlier revisions.
    expect(footer).not.toHaveTextContent("owner@akhdemni.com");
    expect(footer).not.toHaveTextContent("+966");
  });
});
