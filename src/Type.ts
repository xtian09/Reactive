// only consider string type in this case
export type Key = string;

// primitive object
export type Raw = object;

// proxy object
export type RawProxy = object;

// observer
export type Observer = Function & {
  cleaners?: ObserverForKey[];
  unobserved?: boolean;
};

// observers for raw
export type ObserverForRaw = Map<Key, ObserverForKey>;

// observers for key
export type ObserverForKey = Set<Observer>;
