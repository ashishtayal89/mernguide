import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import logger from "./middleware/logger";
import reducers from "./reducers";
import saga from "./saga";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk, sagaMiddleware, logger))
);

window["$state"] = store.getState();
store.subscribe(() => {
  window["$state"] = store.getState();
});

sagaMiddleware.run(saga);

export default store;
