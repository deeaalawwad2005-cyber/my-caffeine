import Common "common";

module {
  /// Category of academic service requested.
  public type ServiceType = {
    #homework;
    #presentation;
    #research;
    #translation;
    #programming;
    #other;
  };

  /// Lifecycle status of a service request.
  public type RequestStatus = {
    #new;
    #inProgress;
    #completed;
    #cancelled;
  };

  /// A submitted academic-service request.
  public type ServiceRequest = {
    id : Nat;
    reference : Common.RequestReference;
    serviceType : ServiceType;
    description : Text;
    fullName : Text;
    phone : Text;
    email : ?Text;
    university : ?Text;
    deadline : ?Text;
    createdAt : Common.Timestamp;
    status : RequestStatus;
  };

  /// Input payload for submitting a new request.
  public type SubmitRequestInput = {
    serviceType : ServiceType;
    description : Text;
    fullName : Text;
    phone : Text;
    email : ?Text;
    university : ?Text;
    deadline : ?Text;
  };

  /// Optional filters for listing requests.
  public type RequestFilter = {
    status : ?RequestStatus;
    serviceType : ?ServiceType;
    search : ?Text;
  };
};
