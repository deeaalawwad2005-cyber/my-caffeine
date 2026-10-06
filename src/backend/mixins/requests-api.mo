import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import EmailClient "mo:caffeineai-email/emailClient";
import Types "../types/requests";
import RequestsLib "../lib/requests";

mixin (
  accessControlState : AccessControl.AccessControlState,
  requests : Map.Map<Nat, Types.ServiceRequest>,
  settings : { var nextRequestId : Nat; var notificationEmail : Text },
) {
  /// Public endpoint: submit a new academic-service request. No authentication
  /// required. Returns the created request including its reference number.
  public shared func submitRequest(input : Types.SubmitRequestInput) : async Types.ServiceRequest {
    switch (RequestsLib.validateSubmission(input)) {
      case (#err(message)) { Runtime.trap(message) };
      case (#ok) {};
    };

    let id = settings.nextRequestId;
    settings.nextRequestId := id + 1;

    let request = RequestsLib.createRequest(id, input, Time.now().toNat());
    requests.add(id, request);

    // Notification emails are best-effort: the request is already stored, so a
    // transient email-service failure must never roll back a valid submission.
    ignore await notifyAdmin(request);
    switch (request.email) {
      case (?customerEmail) {
        if (customerEmail != "") {
          ignore await notifyCustomer(customerEmail, request);
        };
      };
      case null {};
    };

    request;
  };

  /// Admin-only: list requests with optional status / service-type / search filters.
  public query ({ caller }) func listRequests(filter : Types.RequestFilter) : async [Types.ServiceRequest] {
    requireAdmin(caller);
    RequestsLib.listRequests(requests, filter);
  };

  /// Admin-only: fetch a single request by id.
  public query ({ caller }) func getRequest(id : Nat) : async ?Types.ServiceRequest {
    requireAdmin(caller);
    RequestsLib.getRequest(requests, id);
  };

  /// Admin-only: change the status of a request.
  public shared ({ caller }) func updateRequestStatus(
    id : Nat,
    status : Types.RequestStatus,
  ) : async ?Types.ServiceRequest {
    requireAdmin(caller);
    RequestsLib.updateStatus(requests, id, status);
  };

  /// Admin-only: read the configured notification recipient address.
  public query ({ caller }) func getNotificationEmail() : async Text {
    requireAdmin(caller);
    settings.notificationEmail;
  };

  /// Admin-only: set the notification recipient address.
  public shared ({ caller }) func setNotificationEmail(email : Text) : async () {
    requireAdmin(caller);
    settings.notificationEmail := email;
  };

  // --- helpers ---

  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
  };

  func serviceTypeLabel(serviceType : Types.ServiceType) : Text {
    switch (serviceType) {
      case (#homework) { "تدقيق الواجبات" };
      case (#presentation) { "عرض تقديمي" };
      case (#research) { "بحث علمي" };
      case (#translation) { "ترجمة" };
      case (#programming) { "برمجة" };
      case (#other) { "أخرى" };
    };
  };

  func notifyAdmin(request : Types.ServiceRequest) : async Bool {
    let recipient = settings.notificationEmail;
    if (recipient == "") {
      return true;
    };
    let emailLine = switch (request.email) {
      case (?value) { if (value == "") { "" } else { "البريد الإلكتروني: " # value # "\n" } };
      case null { "" };
    };
    let universityLine = switch (request.university) {
      case (?value) { if (value == "") { "" } else { "الجامعة/التخصص: " # value # "\n" } };
      case null { "" };
    };
    let deadlineLine = switch (request.deadline) {
      case (?value) { if (value == "") { "" } else { "الموعد النهائي: " # value # "\n" } };
      case null { "" };
    };
    let body = "طلب خدمة أكاديمية جديد" # "\n\n"
      # "الرقم المرجعي: " # request.reference # "\n"
      # "الاسم الكامل: " # request.fullName # "\n"
      # "رقم الهاتف: " # request.phone # "\n"
      # emailLine
      # universityLine
      # deadlineLine
      # "نوع الخدمة: " # serviceTypeLabel(request.serviceType) # "\n"
      # "وصف الطلب: " # request.description;
    let result = try {
      ?(await EmailClient.sendServiceEmail(
        "no-reply",
        [recipient],
        "طلب خدمة أكاديمية جديد - " # request.reference,
        body,
      ));
    } catch (_error) {
      null;
    };
    switch (result) {
      case (?#ok) { true };
      case (?#err(_error)) { false };
      case null { false };
    };
  };

  func notifyCustomer(customerEmail : Text, request : Types.ServiceRequest) : async Bool {
    let body = "شكراً لك على إرسال طلبك إلى اخدمني." # "\n\n"
      # "الرقم المرجعي: " # request.reference # "\n"
      # "نوع الخدمة: " # serviceTypeLabel(request.serviceType) # "\n"
      # "وصف الطلب: " # request.description # "\n"
      # "الحالة: جديد";
    let result = try {
      ?(await EmailClient.sendServiceEmail(
        "no-reply",
        [customerEmail],
        "تأكيد استلام طلبك - " # request.reference,
        body,
      ));
    } catch (_error) {
      null;
    };
    switch (result) {
      case (?#ok) { true };
      case (?#err(_error)) { false };
      case null { false };
    };
  };
};
