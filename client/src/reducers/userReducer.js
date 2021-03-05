import { FETCH_USER } from "../actions/types";

export default function(state = { data: {}, isFetching: false }, action) {
  console.log("Reducer");
  switch (action.type) {
    case FETCH_USER:
      return { data: { isFetching: true } };
    default:
      return state;
  }
}
