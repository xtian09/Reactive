let o = {
  a: 1,
};
let value = o["a"];
let valueB = o["b"];

Object.defineProperty(o, "a", {
  enumerable: true,
  configurable: true,
  get() {
    console.log("a 属性被访问到了！");
    return value;
  },
  set(newValue) {
    console.log("a 属性被修改了，新值为:", newValue, ",旧值为：", value);
    value = newValue;
  },
});

o.a;
o.a = 2;

o.b = 1;

Object.defineProperty(o, "b", {
  enumerable: true,
  configurable: true,
  get() {
    console.log("b 属性被访问到了！");
    return valueB;
  },
  set(newValue) {
    console.log("b 属性被修改了，新值为:", newValue, ",旧值为：", valueB);
    valueB = newValue;
  },
});

let z;
console.log(z || "wo");
