import { take } from "redux-saga/effects";

export default function* saga1() {
  while (true) {
    yield take("*");
    console.log("saga");
  }
}
