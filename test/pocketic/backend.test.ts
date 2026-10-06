import { PocketIc, createIdentity } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers an empty-state read instead of trapping", async () => {
  await expect(actor.getApiDoc()).resolves.toContain("اخدمني");
});

it("round-trips a request through the real canister", async () => {
  const created = await actor.submitRequest({
    serviceType: { homework: null },
    description: "حل واجب الرياضيات الفصل الأول",
    fullName: "محمد عبدالله",
    phone: "0501234567",
    email: [],
    university: [],
    deadline: [],
  });

  expect(created.reference).toMatch(/^AKH-\d{6}$/);
  expect(created.status).toEqual({ new: null });
  expect(created.fullName).toBe("محمد عبدالله");
});

it("rejects a submission with a blank name", async () => {
  await expect(
    actor.submitRequest({
      serviceType: { homework: null },
      description: "وصف صحيح للطلب",
      fullName: "   ",
      phone: "0501234567",
      email: [],
      university: [],
      deadline: [],
    }),
  ).rejects.toThrow();
});

it("rejects a submission with a malformed phone number", async () => {
  await expect(
    actor.submitRequest({
      serviceType: { homework: null },
      description: "وصف صحيح للطلب",
      fullName: "محمد عبدالله",
      phone: "abc",
      email: [],
      university: [],
      deadline: [],
    }),
  ).rejects.toThrow();
});

it("guards admin reads from an anonymous caller", async () => {
  const guest = pic!.createActor<_SERVICE>(idlFactory, canisterId);
  await expect(guest.listRequests({ status: [], serviceType: [], search: [] })).rejects.toThrow();
});

it("lets the installing admin list and update a request", async () => {
  const admin = createIdentity("admin");
  const installed = await pic!.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
    sender: admin.getPrincipal(),
  });
  installed.actor.setIdentity(admin);
  // The first caller to initialize access control becomes the admin.
  await installed.actor._initialize_access_control();

  const created = await installed.actor.submitRequest({
    serviceType: { research: null },
    description: "إعداد بحث علمي محكم",
    fullName: "سارة أحمد",
    phone: "+966501234567",
    email: [],
    university: [],
    deadline: [],
  });

  const listed = await installed.actor.listRequests({
    status: [],
    serviceType: [],
    search: [],
  });
  expect(listed.map((r) => r.id)).toContain(created.id);

  const updated = await installed.actor.updateRequestStatus(created.id, {
    completed: null,
  });
  expect(updated).not.toBeNull();
  expect(updated?.[0]?.status).toEqual({ completed: null });
});

it("defaults the admin notification email to the owner's address", async () => {
  const admin = createIdentity("admin-notify-default");
  const installed = await pic!.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
    sender: admin.getPrincipal(),
  });
  installed.actor.setIdentity(admin);
  await installed.actor._initialize_access_control();

  await expect(installed.actor.getNotificationEmail()).resolves.toBe(
    "deeaalawwad00@gmail.com",
  );
});

it("round-trips a changed notification email through the real canister", async () => {
  const admin = createIdentity("admin-notify-set");
  const installed = await pic!.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
    sender: admin.getPrincipal(),
  });
  installed.actor.setIdentity(admin);
  await installed.actor._initialize_access_control();

  await installed.actor.setNotificationEmail("owner-updated@example.com");
  await expect(installed.actor.getNotificationEmail()).resolves.toBe(
    "owner-updated@example.com",
  );
});

it("filters requests by status, service type and search term", async () => {
  const admin = createIdentity("admin-filters");
  const installed = await pic!.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
    sender: admin.getPrincipal(),
  });
  installed.actor.setIdentity(admin);
  await installed.actor._initialize_access_control();

  const homework = await installed.actor.submitRequest({
    serviceType: { homework: null },
    description: "حل واجب الرياضيات الفصل الأول",
    fullName: "محمد عبدالله",
    phone: "0501234567",
    email: [],
    university: [],
    deadline: [],
  });
  const translation = await installed.actor.submitRequest({
    serviceType: { translation: null },
    description: "ترجمة مستند من العربية إلى الإنجليزية",
    fullName: "سارة أحمد",
    phone: "+966501234567",
    email: [],
    university: [],
    deadline: [],
  });
  await installed.actor.updateRequestStatus(translation.id, {
    completed: null,
  });

  const byStatus = await installed.actor.listRequests({
    status: [{ completed: null }],
    serviceType: [],
    search: [],
  });
  expect(byStatus.map((r) => r.id)).toEqual([translation.id]);

  const byType = await installed.actor.listRequests({
    status: [],
    serviceType: [{ homework: null }],
    search: [],
  });
  expect(byType.map((r) => r.id)).toEqual([homework.id]);

  const bySearch = await installed.actor.listRequests({
    status: [],
    serviceType: [],
    search: ["سارة"],
  });
  expect(bySearch.map((r) => r.id)).toEqual([translation.id]);
});
