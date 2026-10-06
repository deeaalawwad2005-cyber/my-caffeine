import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Types "../types/requests";

module {
  /// Validates a submission payload. Returns `#ok` when valid, otherwise `#err`
  /// with a human-readable reason.
  public func validateSubmission(input : Types.SubmitRequestInput) : { #ok; #err : Text } {
    if (input.fullName.trim(#predicate(func c = c == ' ')) == "") {
      return #err("الاسم الكامل مطلوب");
    };
    if (input.description.trim(#predicate(func c = c == ' ')) == "") {
      return #err("وصف الطلب مطلوب");
    };
    if (not isValidPhone(input.phone)) {
      return #err("رقم الهاتف مطلوب بصيغة صحيحة");
    };
    #ok;
  };

  /// Builds a `ServiceRequest` from a validated payload, assigning the next id
  /// and a reference number.
  public func createRequest(
    nextId : Nat,
    input : Types.SubmitRequestInput,
    createdAt : Nat,
  ) : Types.ServiceRequest {
    {
      id = nextId;
      reference = formatReference(nextId);
      serviceType = input.serviceType;
      description = input.description;
      fullName = input.fullName;
      phone = input.phone;
      email = input.email;
      university = input.university;
      deadline = input.deadline;
      createdAt;
      status = #new;
    };
  };

  /// Returns all requests matching the given filter, newest first.
  public func listRequests(
    requests : Map.Map<Nat, Types.ServiceRequest>,
    filter : Types.RequestFilter,
  ) : [Types.ServiceRequest] {
    let matched = requests.values().filter(func r = matchesFilter(r, filter)).toArray();
    matched.sort(func(a, b) = Nat.compare(b.createdAt, a.createdAt));
  };

  /// Returns a single request by id, if present.
  public func getRequest(
    requests : Map.Map<Nat, Types.ServiceRequest>,
    id : Nat,
  ) : ?Types.ServiceRequest {
    requests.get(id);
  };

  /// Updates the status of a request. Returns the updated request, or `null`
  /// when no request with that id exists.
  public func updateStatus(
    requests : Map.Map<Nat, Types.ServiceRequest>,
    id : Nat,
    status : Types.RequestStatus,
  ) : ?Types.ServiceRequest {
    switch (requests.get(id)) {
      case (?existing) {
        let updated = { existing with status };
        requests.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  // --- helpers ---

  func matchesFilter(request : Types.ServiceRequest, filter : Types.RequestFilter) : Bool {
    let statusOk = switch (filter.status) {
      case (?s) { request.status == s };
      case null { true };
    };
    let typeOk = switch (filter.serviceType) {
      case (?t) { request.serviceType == t };
      case null { true };
    };
    let searchOk = switch (filter.search) {
      case (?term) {
        let q = term.toLower();
        if (q == "") {
          true;
        } else {
          request.fullName.toLower().contains(#text q)
          or request.phone.toLower().contains(#text q)
          or request.reference.toLower().contains(#text q)
          or request.description.toLower().contains(#text q);
        };
      };
      case null { true };
    };
    statusOk and typeOk and searchOk;
  };

  func isValidPhone(phone : Text) : Bool {
    let trimmed = phone.trim(#predicate(func c = c == ' '));
    if (trimmed == "") {
      return false;
    };
    var digitCount = 0;
    for (c in trimmed.toIter()) {
      if (c >= '0' and c <= '9') {
        digitCount += 1;
      } else if (c == '+' or c == '-' or c == ' ' or c == '(' or c == ')') {
        // allowed separator
      } else {
        return false;
      };
    };
    digitCount >= 7 and digitCount <= 15;
  };

  func formatReference(id : Nat) : Text {
    let digits = id.toText();
    let padding = if (digits.size() >= 6) { "" } else {
      var zeros = "";
      var i = digits.size();
      while (i < 6) {
        zeros := zeros # "0";
        i += 1;
      };
      zeros;
    };
    "AKH-" # padding # digits;
  };
};
