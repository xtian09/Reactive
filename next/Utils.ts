export function isObject(val: any): val is object {
  return typeof val === "object" && val !== "null";
}

export function isSymbol(val: unknown): val is symbol {
  return typeof val === "symbol";
}

export function def(obj: object, key: string | symbol, value: any) {
  Object.defineProperty(obj, key, {
    configurable: true,
    value,
  });
}

export const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(
  val: object,
  key: string | symbol
): key is keyof typeof val {
  return hasOwnProperty.call(val, key);
}
