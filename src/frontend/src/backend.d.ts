import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Cell {
    value: Value;
    name: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface RequestFilter {
    status?: RequestStatus;
    serviceType?: ServiceType;
    search?: string;
}
export type RequestReference = string;
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface ServiceRequest {
    id: bigint;
    status: RequestStatus;
    serviceType: ServiceType;
    createdAt: Timestamp;
    reference: RequestReference;
    fullName: string;
    description: string;
    deadline?: string;
    email?: string;
    university?: string;
    phone: string;
}
export interface SubmitRequestInput {
    serviceType: ServiceType;
    fullName: string;
    description: string;
    deadline?: string;
    email?: string;
    university?: string;
    phone: string;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum RequestStatus {
    new = "new",
    cancelled = "cancelled",
    completed = "completed",
    inProgress = "inProgress"
}
export enum ServiceType {
    other = "other",
    research = "research",
    homework = "homework",
    translation = "translation",
    presentation = "presentation",
    programming = "programming"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    execute(qJson: string): Promise<Result>;
    /**
     * / Returns a static Markdown description of the backend's public API.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Admin-only: read the configured notification recipient address.
     */
    getNotificationEmail(): Promise<string>;
    /**
     * / Admin-only: fetch a single request by id.
     */
    getRequest(id: bigint): Promise<ServiceRequest | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Admin-only: list requests with optional status / service-type / search filters.
     */
    listRequests(filter: RequestFilter): Promise<Array<ServiceRequest>>;
    schema(): Promise<string>;
    /**
     * / Admin-only: set the notification recipient address.
     */
    setNotificationEmail(email: string): Promise<void>;
    /**
     * / Public endpoint: submit a new academic-service request. No authentication
     * / required. Returns the created request including its reference number.
     */
    submitRequest(input: SubmitRequestInput): Promise<ServiceRequest>;
    /**
     * / Admin-only: change the status of a request.
     */
    updateRequestStatus(id: bigint, status: RequestStatus): Promise<ServiceRequest | null>;
}
