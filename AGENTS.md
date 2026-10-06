# Project Guidance

## User Preferences

- اسم الموقع: اخدمني
- الواجهة باللغة العربية واتجاه RTL
- رقم استلام الطلبات: 0781389411
- إيميل استلام الطلبات: deeaalawwad00@gmail.com
- الطلب يشمل الاسم ورقم الهاتف للتواصل
- الأسعار من 2 إلى 6 دنانير كحد أقصى
- اسم خدمة الواجبات هو 'تدقيق الواجبات' (وليس 'حل الواجبات')

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Backend: submitRequest must store the request before sending notifications and treat email failures as non-fatal (notify helpers return Bool, never Runtime.trap) so a valid submission is never rolled back.
- OQL *Value.mo modules imported in main.mo are load-bearing for .toEntity/.sample schema derivation even when not referenced in the actor body; do not remove them as dead code.
- With mops.toml check-limit=1, fold new stable state into the single pending migration file instead of adding a second timestamped migration.
- Frontend: lib/backend.ts re-exports only RequestFilter/RequestStatus/ServiceRequest/SubmitRequestInput; import ServiceType from @/backend directly.
- Frontend: TanStack Router route components can start as null placeholders while the route tree and Layout shell are wired; page tasks replace the component bodies.
- Testing: the app now has a Vitest + React Testing Library frontend suite and a PocketIC backend lane; run the full gate with `pnpm --dir app test` and `pnpm --dir app typecheck`.
- caffeineai-email 0.3.0 sendServiceEmail can trap when INTEGRATIONS_CANISTER_ID is unset; wrap every sendServiceEmail call in try/catch and treat a caught trap as a non-fatal failure so submitRequest never rolls back.
- The applied migration 00000000_000000.mo is read-only (frozen); a default value change must go in a new pending timestamped migration whose OldActor equals the previous file's NewActor.
- WhatsApp deep links need the international number without '+': a local Iraqi 0-prefixed number (0781389411) must be normalized to 964781389411 for wa.me to open the right chat.
- Reusing one exported PRICE_RANGE_NOTICE constant keeps the Arabic price-range copy identical across form, services, steps, and FAQ surfaces.
- The homework service label is 'تدقيق الواجبات' across all surfaces; lib/service-types.ts is the single source of truth and the backend serviceTypeLabel(#homework) must match it.
- The full Caffeine build pipeline (frontend typecheck+fix+build, backend mops check+build, bindgen) completes cleanly with exit code 0; a 'Failed to go live' report was not reproducible as a compile/build failure.
- The app has a Vitest + React Testing Library frontend suite (48 tests) and a PocketIC backend lane (9 tests) run via `pnpm --dir app test`; the PocketIC lane exercises the real canister.
- backend.d.ts is a stale partial declaration shadowed by backend.ts under moduleResolution:bundler; it is inert and not a repair target.
- Migration chain is consistent: 00000000_000000.mo NewActor shape equals 20261006_153500.mo OldActor shape, satisfying check-limit=1.
