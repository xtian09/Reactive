import { baseHandlers } from "./BaseHandler";
import { Raw, RawProxy } from "./Type";
import { storeObservers } from "./Observer";

export const proxyToRaw = new WeakMap<RawProxy, Raw>();
export const rawToProxy = new WeakMap<Raw, RawProxy>();

export function Observable<T extends Raw>(r: T): T {
  if (proxyToRaw.has(r)) {
    return r;
  }
  const existProxy = rawToProxy.get(r);
  if (existProxy) {
    return existProxy as T;
  }
  return createProxy(r);
}

function createProxy<T extends Raw>(r: T): T {
  const proxy = new Proxy(r, baseHandlers);
  rawToProxy.set(r, proxy);
  proxyToRaw.set(proxy, r);
  storeObservers(r);
  return proxy as T;
}
