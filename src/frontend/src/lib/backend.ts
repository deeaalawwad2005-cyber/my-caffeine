import { createActor } from "@/backend";
import type {
  RequestFilter,
  RequestStatus,
  ServiceRequest,
  SubmitRequestInput,
} from "@/backend";

/**
 * Typed convenience wrappers around the generated backend actor.
 *
 * The generated `createActor` is the single source of truth for the canister
 * interface; these helpers only add narrow, well-named signatures so pages and
 * hooks never have to reach into the generated bindings directly.
 */

export type BackendActor = ReturnType<typeof createActor>;

export type { RequestFilter, RequestStatus, ServiceRequest, SubmitRequestInput };

export function submitRequest(
  actor: BackendActor,
  input: SubmitRequestInput,
): Promise<ServiceRequest> {
  return actor.submitRequest(input);
}

export function listRequests(
  actor: BackendActor,
  filter: RequestFilter = {},
): Promise<ServiceRequest[]> {
  return actor.listRequests(filter);
}

export function getRequest(
  actor: BackendActor,
  id: bigint,
): Promise<ServiceRequest | null> {
  return actor.getRequest(id);
}

export function updateRequestStatus(
  actor: BackendActor,
  id: bigint,
  status: RequestStatus,
): Promise<ServiceRequest | null> {
  return actor.updateRequestStatus(id, status);
}

export function getNotificationEmail(actor: BackendActor): Promise<string> {
  return actor.getNotificationEmail();
}

export function setNotificationEmail(
  actor: BackendActor,
  email: string,
): Promise<void> {
  return actor.setNotificationEmail(email);
}
