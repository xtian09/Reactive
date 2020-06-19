import { isObject } from "../origin/Utils";
import { Observable, ObservableFlags } from "./Type";
import { hasOwn, def } from "./Utils";
import { baseHandlers } from "./BaseHandler";

export function observable(target: object) {
  if (!isObject(target)) {
    console.warn(`value cannot be made observable: ${String(target)}`);
    return target;
  }
  // target is already a Proxy, return it.
  if ((target as any)[ObservableFlags.raw]) {
    return target;
  }
  // target already has corresponding Proxy
  if (hasOwn(target, ObservableFlags.observable)) {
    return (target as any)[ObservableFlags.observable];
  }
  const observed = new Proxy(target, baseHandlers);
  def(target, ObservableFlags.observable, observed);
  return observed;
}

export function toRaw<T>(observed: T): T {
  return (
    (observed && toRaw((observed as Observable)[ObservableFlags.raw])) ||
    observed
  );
}
