# Design Brief

## Direction

المِرقَم الأكاديمي (The Academic Ledger) — a trustworthy Arabic RTL academic-services request site where students submit assignments and admins triage them like a well-kept ledger.

## Tone

Editorial-academic with modern restraint: deep teal-blue "ink" on warm paper surfaces, generous whitespace, and one warm ochre accent — scholarly and calm, never corporate-generic.

## Differentiation

The warm ochre accent used the way a professor's highlighter marks a paper — sparingly on active states, the primary CTA underline, and status emphasis — against a deep teal-blue that reads as institutional trust rather than safe corporate navy.

## Color Palette

| Token      | OKLCH        | Role                                      |
| ---------- | ------------ | ----------------------------------------- |
| background | 0.985 0.006 230 | Warm off-white paper (light)           |
| foreground | 0.22 0.03 245   | Deep ink text                          |
| card       | 1 0.003 230     | Elevated white card surface            |
| primary    | 0.44 0.11 235   | Deep teal-blue — brand, CTAs, links    |
| accent     | 0.72 0.145 68   | Warm ochre — highlights, active states |
| muted      | 0.955 0.01 232  | Section alternation, quiet surfaces    |
| success    | 0.58 0.13 158   | مكتمل status                           |
| warning    | 0.78 0.15 78    | قيد التنفيذ status                     |
| destructive| 0.55 0.21 27    | ملغي, errors                           |

Status badge tokens (bg/fg pairs): `--status-new` (جديد, blue 250), `--status-progress` (قيد التنفيذ, amber 78), `--status-done` (مكتمل, green 158), `--status-cancelled` (ملغي, red 27).

## Typography

- Display: Cairo (Arabic) → Tajawal → IBM Plex Sans Arabic → Plus Jakarta Sans — headings, hero, section titles
- Body: Cairo / Figtree stack — paragraphs, UI labels, form fields
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-2xl md:text-4xl font-bold`, label `text-sm font-semibold`, body `text-base md:text-lg leading-relaxed`
- Arabic-first stack; Latin numerals fall back to Plus Jakarta Sans. RTL via `dir="rtl"` and logical spacing (`gap`, `ms-`/`me-`).

## Elevation & Depth

Two-tier shadow hierarchy (`shadow-subtle`, `shadow-elevated`) plus hairline `border-border`; cards lift on hover, never glow. Depth comes from layered surfaces, not gradients.

## Structural Zones

| Zone    | Background        | Border      | Notes                                          |
| ------- | ----------------- | ----------- | ---------------------------------------------- |
| Header  | `bg-card/95` blur | `border-b`  | Sticky, logo right (RTL), nav center, CTA left |
| Hero    | `bg-gradient-subtle` | —        | Warm paper wash, ochre underline accent        |
| Content | `bg-background`   | —           | Alternating sections use `bg-muted/40`         |
| Cards   | `bg-card`         | `border`    | `rounded-2xl`, `shadow-subtle`, hover lift     |
| Footer  | `bg-muted/40`     | `border-t`  | Contact + quick links, muted foreground        |

## Spacing & Rhythm

Section gaps `py-16 md:py-24`, content max-width `max-w-6xl`, card padding `p-6 md:p-8`, micro-spacing on a 4px scale with `gap-3`/`gap-6` groupings.

## Component Patterns

- Buttons: `rounded-xl`, primary = solid teal-blue, accent = ochre for the hero CTA, ghost/outline for secondary; hover darkens + slight lift.
- Cards: `rounded-2xl bg-card border border-border shadow-subtle`, hover → `shadow-elevated` + `-translate-y-0.5`.
- Badges: `rounded-full px-3 py-1 text-xs font-semibold` using the four status token pairs.
- Inputs: `rounded-xl border-input bg-card`, focus ring `ring-ring`, Arabic error text in `text-destructive`.

## Motion

- Entrance: `animate-fade-up` on hero and section content, staggered ~80ms; `animate-scale-in` for confirmation screen.
- Hover: `transition-smooth` on buttons/cards with subtle lift.
- Decorative: `animate-pulse-soft` on the "قيد التنفيذ" badge indicator only.

## Constraints

- Arabic RTL throughout; use logical properties, never hard-coded left/right.
- No external font CDN — bundled Latin font + system Arabic stack only.
- Token-only styling: no hex/rgb literals or arbitrary Tailwind colors in components.
- No file uploads and no WhatsApp/SMS UI (out of scope).
- Responsive mobile-first (`sm`/`md`/`lg`).

## Signature Detail

The ochre "highlighter" underline beneath the hero word «اخدمني» — a hand-marked-paper gesture that ties the whole academic-ledger identity together.
