import OQL "mo:caffeineai-oql";
import Types "types/requests";

module {
  /// Converts a request-status variant to its tag text.
  public func _toRow(self : Types.RequestStatus) : OQL.Value =
    #text(
      switch self {
        case (#new) { "new" };
        case (#inProgress) { "inProgress" };
        case (#completed) { "completed" };
        case (#cancelled) { "cancelled" };
      }
    );
};
