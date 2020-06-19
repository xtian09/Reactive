import { ObserverOptions } from "./Type";
import { Observer } from "./Type";
import { ObserverForRaw } from "./Type";
import { queueJob } from "./Scheduler";

const observerStack: Observer[] = [];
const observers = new WeakMap<any, ObserverForRaw>();
let activeObserver: Observer | undefined;

function isObserver(fn: any): fn is Observer {
  return fn && fn._isObserver === true;
}

export function observe<T = any>(
  func: () => T,
  options: ObserverOptions = {}
): Observer<T> {
  if (isObserver(func)) {
    func = func.raw;
  }
  const observer = createObserver(func, options);
  observer();
  return observer;
}

export function watch<T = any>(func: () => T): Observer<T> {
  return observe(func, {
    scheduler: (o: Observer) => {
      queueJob(o);
    },
  });
}

export function stop(o: Observer) {
  if (o.active) {
    cleanup(o);
    o.active = false;
  }
}

export function collect(target: object, key: unknown) {
  if (activeObserver === undefined) {
    return;
  }
  let depsMap = observers.get(target);
  if (!depsMap) {
    observers.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeObserver)) {
    dep.add(activeObserver);
    activeObserver.deps.push(dep);
  }
}

export function notify(target: object, key?: unknown) {
  const depsMap = observers.get(target);
  if (!depsMap) {
    return;
  }
  const depsKey = new Set<Observer>();
  const deps = depsMap.get(key);
  deps &&
    deps.forEach((o) => {
      if (o !== activeObserver) {
        depsKey.add(o);
      }
    });
  depsKey.forEach((o) => {
    if (o.options.scheduler) {
      o.options.scheduler(o);
    } else {
      o();
    }
  });
}

function createObserver<T = any>(
  fn: (...args: any[]) => T,
  options: ObserverOptions
): Observer<T> {
  const observer = function reactiveEffect(...args: unknown[]): unknown {
    if (!observer.active) {
      return options.scheduler ? undefined : fn(...args);
    }
    if (!observerStack.includes(observer)) {
      cleanup(observer);
      try {
        observerStack.push(observer);
        activeObserver = observer;
        return fn(...args);
      } finally {
        observerStack.pop();
        activeObserver = observerStack[observerStack.length - 1];
      }
    }
  } as Observer;
  observer._isObserver = true;
  observer.active = true;
  observer.raw = fn;
  observer.deps = [];
  observer.options = options;
  return observer;
}

function cleanup(o: Observer) {
  const { deps } = o;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(o);
    }
    deps.length = 0;
  }
}
