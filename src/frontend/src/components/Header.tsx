import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-backend";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "الرئيسية", to: "/" as const },
  { label: "خدماتنا", to: "/" as const, hash: "services" },
  { label: "كيف نعمل", to: "/" as const, hash: "how-it-works" },
  { label: "الأسئلة الشائعة", to: "/" as const, hash: "faq" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (to: string, hash?: string) =>
    location.pathname === to && (hash ? location.hash === hash : true);

  return (
    <header
      data-ocid="site.header"
      className="sticky top-0 z-50 border-b border-border bg-card/95 shadow-subtle backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          to="/"
          data-ocid="site.logo_link"
          className="flex items-center gap-2.5 transition-smooth hover:opacity-90"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-subtle">
            <GraduationCap className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold text-foreground">
              اخدمني
            </span>
            <span className="mt-0.5 text-[0.7rem] text-muted-foreground">
              خدمات أكاديمية موثوقة
            </span>
          </span>
        </Link>

        <nav
          aria-label="التنقل الرئيسي"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={link.hash}
              data-ocid={`site.nav.${link.hash ?? "home"}`}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-smooth hover:bg-secondary hover:text-foreground",
                isActive(link.to, link.hash)
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link
              to="/admin"
              data-ocid="site.nav.admin"
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-smooth hover:bg-secondary hover:text-foreground",
                location.pathname.startsWith("/admin")
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              لوحة الإدارة
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            data-ocid="site.request_button"
            className="hidden rounded-full px-5 sm:inline-flex"
          >
            <Link to="/request">اطلب خدمة</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileOpen}
            data-ocid="site.menu_button"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          data-ocid="site.mobile_menu"
          className="border-t border-border bg-card md:hidden"
        >
          <nav
            aria-label="التنقل للجوال"
            className="container flex flex-col gap-1 py-3"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                hash={link.hash}
                data-ocid={`site.mobile_nav.${link.hash ?? "home"}`}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                to="/admin"
                data-ocid="site.mobile_nav.admin"
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                لوحة الإدارة
              </Link>
            ) : null}
            <Button
              asChild
              className="mt-2 rounded-full"
              data-ocid="site.mobile_request_button"
            >
              <Link to="/request" onClick={() => setMobileOpen(false)}>
                اطلب خدمة
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
