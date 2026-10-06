import OQL "mo:caffeineai-oql";

module {
  /// Converts an optional Text field to a single OQL value, using the empty
  /// string as the sentinel for `null`.
  public func _toRow(self : ?Text) : OQL.Value =
    switch self {
      case null { #text("") };
      case (?t) { #text(t) };
    };
};
