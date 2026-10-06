import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The Arabic/RTL direction is declared on the shipped document shell rather
 * than by any React component, so it is asserted against `index.html` itself.
 * Vitest runs with the frontend package as its working directory.
 */
const indexHtml = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

describe("document shell", () => {
  it("declares Arabic language and right-to-left direction", () => {
    expect(indexHtml).toMatch(/<html[^>]*\blang="ar"/);
    expect(indexHtml).toMatch(/<html[^>]*\bdir="rtl"/);
  });

  it("sets an Arabic page title and viewport for mobile and desktop", () => {
    expect(indexHtml).toContain("<title>اخدمني");
    expect(indexHtml).toContain('name="viewport"');
  });
});
