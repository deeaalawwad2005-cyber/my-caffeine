import { phoneHref, whatsappHref } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, MessageCircle, Phone } from "lucide-react";

const CONTACT_PHONE = "0781389411";
const CONTACT_EMAIL = "deeaalawwad00@gmail.com";

const QUICK_LINKS = [
  { label: "الرئيسية", to: "/" as const },
  { label: "اطلب خدمة", to: "/request" as const },
  { label: "خدماتنا", to: "/" as const, hash: "services" },
  { label: "الأسئلة الشائعة", to: "/" as const, hash: "faq" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ocid="site.footer"
      className="border-t border-border bg-secondary/60"
    >
      <div className="container grid gap-10 py-12 md:grid-cols-3 md:py-16">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-bold text-foreground">
              اخدمني
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            خدمات أكاديمية موثوقة: تدقيق الواجبات، العروض التقديمية، الأبحاث،
            الترجمة، والمشاريع البرمجية — بجودة عالية وتسليم في الوقت المحدد.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-base font-semibold text-foreground">
            روابط سريعة
          </h2>
          <ul className="space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  hash={link.hash}
                  data-ocid={`site.footer_link.${link.hash ?? (link.to.replace("/", "") || "home")}`}
                  className="text-sm text-muted-foreground transition-smooth hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-base font-semibold text-foreground">
            تواصل معنا
          </h2>
          <ul className="space-y-3">
            <li>
              <a
                href={whatsappHref(CONTACT_PHONE)}
                target="_blank"
                rel="noreferrer"
                data-ocid="site.footer_whatsapp"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-subtle transition-smooth hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
                تواصل عبر واتساب
              </a>
            </li>
            <li>
              <a
                href={phoneHref(CONTACT_PHONE)}
                data-ocid="site.footer_phone"
                className="flex items-center gap-2.5 text-sm text-muted-foreground transition-smooth hover:text-primary"
              >
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                <span dir="ltr">{CONTACT_PHONE}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                data-ocid="site.footer_email"
                className="flex items-center gap-2.5 text-sm text-muted-foreground transition-smooth hover:text-primary"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span dir="ltr">{CONTACT_EMAIL}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-center text-xs text-muted-foreground sm:flex-row sm:text-start">
          <p>© {year} اخدمني. جميع الحقوق محفوظة.</p>
          <p>
            صُنع بحب باستخدام{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary transition-smooth hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
