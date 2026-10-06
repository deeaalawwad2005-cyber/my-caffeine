import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type ServiceType = {
    #homework;
    #presentation;
    #research;
    #translation;
    #programming;
    #other;
  };

  type RequestStatus = {
    #new;
    #inProgress;
    #completed;
    #cancelled;
  };

  type ServiceRequest = {
    id : Nat;
    reference : Text;
    serviceType : ServiceType;
    description : Text;
    fullName : Text;
    phone : Text;
    email : ?Text;
    university : ?Text;
    deadline : ?Text;
    createdAt : Nat;
    status : RequestStatus;
  };

  public type OldActor = {};

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    requests : Map.Map<Nat, ServiceRequest>;
    settings : { var nextRequestId : Nat; var notificationEmail : Text };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      requests = Map.empty();
      settings = { var nextRequestId = 0; var notificationEmail = "" };
    };
  };
};
