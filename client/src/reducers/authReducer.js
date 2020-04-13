import { FETCH_USER, FETCHING_USER } from "../actions/types";

export default function(state = { data: {}, isFetching: false }, action) {
  switch (action.type) {
    case FETCHING_USER:
      return { ...state, isFetching: true };
    case FETCH_USER:
      return { ...state, data: action.payload, isFetching: false };
    default:
      return state;
  }
}
