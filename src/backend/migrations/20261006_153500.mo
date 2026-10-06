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

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    requests : Map.Map<Nat, ServiceRequest>;
    settings : { var nextRequestId : Nat; var notificationEmail : Text };
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    requests : Map.Map<Nat, ServiceRequest>;
    settings : { var nextRequestId : Nat; var notificationEmail : Text };
  };

  public func migration(old : OldActor) : NewActor {
    let notificationEmail = if (old.settings.notificationEmail == "") {
      "deeaalawwad00@gmail.com";
    } else {
      old.settings.notificationEmail;
    };
    {
      accessControlState = old.accessControlState;
      requests = old.requests;
      settings = {
        var nextRequestId = old.settings.nextRequestId;
        var notificationEmail;
      };
    };
  };
};
