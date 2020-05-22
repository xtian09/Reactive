export const hasOwnProperty = Object.prototype.hasOwnProperty;

export function isObject(val: any): val is object {
  return typeof val === 'object' && val !== 'null';
}
