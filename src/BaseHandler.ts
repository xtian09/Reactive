import { Observable, proxyToRaw, rawToProxy } from "./Observable";
import { Key, Raw, RawProxy } from "./Type";
import { hasOwnProperty, isObject } from "./Utils";
import { notifyObserver, registerObserver } from "./Observer";

function get(target: Raw, key: Key, receiver: RawProxy) {
  const result = Reflect.get(target, key, receiver);
  registerObserver(target, key);
  const observableResult = rawToProxy.get(result);
  if (isObject(result)) {
    if (observableResult) {
      return observableResult;
    }
    return Observable(result);
  }
  return result;
}

function set(target: Raw, key: Key, value: any, receiver: RawProxy) {
  if (isObject(value)) {
    value = proxyToRaw.get(value) || value;
  }
  const hadKey = hasOwnProperty.call(target, key);
  const oldValue = (target as any)[key];
  const result = Reflect.set(target, key, value, receiver);
  if (!hadKey || value !== oldValue) {
    notifyObserver(target, key);
  }
  return result;
}

export const baseHandlers = {
  get,
  set,
};
