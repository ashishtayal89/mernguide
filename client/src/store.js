import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";
import logger from "./middleware/logger";
import reducers from "./reducers";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk, logger))
);

export default store;
