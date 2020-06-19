import { observable } from "./Observable";
import { observe, watch } from "./Observer";

let primitive = {
  human: false,
  gender: false,
};
primitive = observable(primitive);
observe(() => {
  console.log(`this primitive is ${primitive.human ? "human" : "animal"} !`);
});
observe(() => {
  console.log(`this primitive is ${primitive.gender ? "male" : "female"} !`);
});
observe(() => {
  if (primitive.human) {
    console.log(`this human is ${primitive.gender ? "male" : "female"} !\n`);
  } else {
    console.log(`this animal is ${primitive.gender ? "male" : "female"} !\n`);
  }
});

// watch(() => {
//   console.log(`this primitive is ${primitive.human ? "human" : "animal"} !`);
// });
// watch(() => {
//   console.log(`this primitive is ${primitive.gender ? "male" : "female"} !`);
// });
// watch(() => {
//   if (primitive.human) {
//     console.log(`this human is ${primitive.gender ? "male" : "female"} !\n`);
//   } else {
//     console.log(`this animal is ${primitive.gender ? "male" : "female"} !\n`);
//   }
// });
setTimeout(() => {
  Object.assign(primitive, {
    human: true,
    gender: true,
  });
  console.log("assign done !");
}, 2000);
