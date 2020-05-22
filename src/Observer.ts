import { Key, Observer, ObserverForKey, ObserverForRaw, Raw } from './Type';

const observers = new WeakMap<Raw, ObserverForRaw>();
const observersStack: Observer[] = [];

export function storeObservers(r: Raw) {
  observers.set(r, new Map() as ObserverForRaw);
}

export function Observe(f: Function): Observer {
  const observer: Observer = function (this: any, ...args: any[]) {
    return wrapToObserver(observer, f, this, args);
  };
  observer();
  return observer;
}

export function unObserve(o: Observer) {
  if (!o.unobserved) {
    o.unobserved = true;
    releaseObserver(o);
  }
}

export function registerObserver(target: Raw, key: Key) {
  const observer = getRunningObserver();
  if (observer) {
    registerObserverForRaw(observer, target, key);
  }
}

export function notifyObserver(target: Raw, key: Key) {
  getObserverForRaw(target, key).forEach(observer => observer());
}

export function releaseObserver(o: Observer) {
  if (o.cleaners) {
    o.cleaners.forEach(value => {
      value.delete(o);
    });
  }
  o.cleaners = [];
}

function wrapToObserver(o: Observer, f: Function, context: any, args: any[]) {
  if (o.unobserved) {
    return Reflect.apply(f, context, args);
  }
  if (isRunning(o)) {
    return;
  }
  releaseObserver(o);
  try {
    observersStack.push(o);
    return Reflect.apply(f, context, args);
  } finally {
    observersStack.pop();
  }
}

function isRunning(o: Observer) {
  return observersStack.includes(o);
}

function getRunningObserver() {
  const [observer] = observersStack.slice(-1);
  return observer;
}

function registerObserverForRaw(o: Observer, target: Raw, key: Key) {
  const observerForRaw = observers.get(target);
  let observerForKey = observerForRaw!.get(key);
  if (!observerForKey) {
    observerForKey = new Set();
    observerForRaw!.set(key, observerForKey);
  }
  if (!observerForKey.has(o)) {
    observerForKey.add(o);
    if (!o.cleaners) {
      o.cleaners = [];
    }
    o.cleaners.push(observerForKey);
  }
}

function getObserverForRaw(target: Raw, key: Key) {
  const observerForRaw = observers.get(target);
  const observerForKey: ObserverForKey = new Set();
  addObserverForKey(observerForKey, observerForRaw!, key);
  return observerForKey;
}

function addObserverForKey(
  observerForKey: ObserverForKey,
  observerForRaw: ObserverForRaw,
  key: Key
) {
  const observers = observerForRaw.get(key);
  observers &&
    observers.forEach(o => {
      observerForKey.add(o);
    });
}
