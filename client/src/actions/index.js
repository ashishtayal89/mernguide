import { FETCH_USER } from "./types";

export const fetchUser = () => ({
  type: FETCH_USER
});
export const fetchUserThunk = () => dispatch => {
  console.log("Thunk");
  dispatch({
    type: FETCH_USER
  });
};
