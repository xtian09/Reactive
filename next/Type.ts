export const enum ObservableFlags {
  raw = "__r_raw",
  observable = "__r_observable",
}

export type Observable = object & {
  __r_raw?: any;
  __r_observable?: any;
};

// observers for key
export type ObserverForKey = Set<Observer>;

// observers for raw
export type ObserverForRaw = Map<any, ObserverForKey>;

export type Observer<T = any> = {
  (...args: any[]): T;
  _isObserver: true;
  active: boolean;
  raw: () => T;
  deps: ObserverForKey[];
  options: ObserverOptions;
};

export interface ObserverOptions {
  scheduler?: (o: Observer) => void;
}

export interface Job {
  (): void;
}
