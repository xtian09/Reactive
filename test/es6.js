let o = {
  a: 1,
};
let value = o["a"];
let valueB = o["b"];

let get = (target, key, receiver) => {
  const result = Reflect.get(target, key, receiver);
  console.log("get", key, result);
  return result;
};

let set = (target, key, value, receiver) => {
  const result = Reflect.set(target, key, value, receiver);
  console.log("set", key, result);
  return result;
};

let handler = {
  get,
  set,
};

o = new Proxy(o, handler);

o.a;
o.a = 2;
o.b = 1;

// let array = [];
// array = new Proxy(array, handler);
// array[0] = 1;
// array[1] = 2;
