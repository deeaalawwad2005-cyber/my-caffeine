import { phoneHref, whatsappHref } from "@/lib/format";
import { describe, expect, it } from "vitest";

describe("contact link helpers", () => {
  it("normalizes the owner's local number to an international wa.me link", () => {
    expect(whatsappHref("0781389411")).toBe("https://wa.me/964781389411");
  });

  it("keeps an already-international number unchanged", () => {
    expect(whatsappHref("+964781389411")).toBe("https://wa.me/964781389411");
  });

  it("builds a tel: link from the owner's number", () => {
    expect(phoneHref("0781389411")).toBe("tel:0781389411");
  });
});
