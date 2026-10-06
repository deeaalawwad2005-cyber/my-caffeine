import Map "mo:core/Map";
import Nat "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import OptTextValue "OptTextValue";
import ServiceTypeValue "ServiceTypeValue";
import RequestStatusValue "RequestStatusValue";
import Types "types/requests";
import RequestsApi "mixins/requests-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let requests : Map.Map<Nat, Types.ServiceRequest>;
  let settings : { var nextRequestId : Nat; var notificationEmail : Text };

  include RequestsApi(accessControlState, requests, settings);

  include Expose({
    entities = [
      requests.toEntity("serviceRequest", "ServiceRequest", "id")
        .sample({
          id = 0;
          reference = "";
          serviceType = #other;
          description = "";
          fullName = "";
          phone = "";
          email = null;
          university = null;
          deadline = null;
          createdAt = 0;
          status = #new;
        })
        .controllerOnly()
        .build(),
    ];
  });

  include ApiDocMixin();
};
