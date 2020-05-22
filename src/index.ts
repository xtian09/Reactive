import { Observable } from "./Observable";
import { Observe } from "./Observer";

let a = {
  b: false,
  c: true,
};
const counter = Observable(a);

const f = Observe(() => {
  console.log("222");
  if (counter.b) {
    console.log("b is true");
  } else {
    console.log("b is false");
  }
  // if (counter.c) {
  //   console.log("c1 is true");
  // } else {
  //   console.log("c1 is false");
  // }
});

const c = Observe(() => {
  console.log("222");
  if (counter.c) {
    console.log("c2 is true");
  } else {
    console.log("c2 is false");
  }
});

setTimeout(() => {
  Object.assign(counter, { b: true, c: false });
  console.log("111");
}, 2000);
