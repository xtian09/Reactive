import { Observable } from "./Observable";
import { Observe } from "./Observer";

let primitive = {
  human: false,
  gender: false,
};
primitive = Observable(primitive);
Observe(() => {
  console.log(`this primitive is ${primitive.human ? "human" : "animal"} !`);
});
Observe(() => {
  console.log(`this primitive is ${primitive.gender ? "male" : "female"} !`);
});
Observe(() => {
  if (primitive.human) {
    console.log(`this human is ${primitive.gender ? "male" : "female"} !\n`);
  } else {
    console.log(`this animal is ${primitive.gender ? "male" : "female"} !\n`);
  }
});
setTimeout(() => {
  Object.assign(primitive, {
    human: true,
    gender: true,
  });
  console.log("assign done !");
}, 2000);
