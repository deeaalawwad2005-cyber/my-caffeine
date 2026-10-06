import OQL "mo:caffeineai-oql";
import Types "types/requests";

module {
  /// Converts a service-type variant to its tag text.
  public func _toRow(self : Types.ServiceType) : OQL.Value =
    #text(
      switch self {
        case (#homework) { "homework" };
        case (#presentation) { "presentation" };
        case (#research) { "research" };
        case (#translation) { "translation" };
        case (#programming) { "programming" };
        case (#other) { "other" };
      }
    );
};
