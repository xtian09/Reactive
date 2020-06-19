import { ObservableFlags } from "./Type";
import { isSymbol, hasOwn } from "./Utils";
import { isObject } from "./Utils";
import { observable, toRaw } from "./Observable";
import { notify } from "./Observer";
import { collect } from "./Observer";

const builtInSymbols = new Set(
  Object.getOwnPropertyNames(Symbol)
    .map((key) => (Symbol as any)[key])
    .filter(isSymbol)
);

function get(target: object, key: string | symbol, receiver: object): any {
  if (
    key === ObservableFlags.raw &&
    receiver === (target as any)[ObservableFlags.observable]
  ) {
    return target;
  }
  const result = Reflect.get(target, key, receiver);
  if ((isSymbol(key) && builtInSymbols.has(key)) || key === "__proto__") {
    return result;
  }
  collect(target, key);
  if (isObject(result)) {
    return observable(result);
  }
  return result;
}

function set(
  target: object,
  key: string | symbol,
  value: unknown,
  receiver: object
): boolean {
  const oldValue = (target as any)[key];
  const hadKey = hasOwn(target, key);
  const result = Reflect.set(target, key, value, receiver);
  // don't trigger if target is something up in the prototype chain of original
  if (target === toRaw(receiver)) {
    if (!hadKey || value !== oldValue) {
      notify(target, key);
    }
  }
  return result;
}

export const baseHandlers = {
  get,
  set,
};
