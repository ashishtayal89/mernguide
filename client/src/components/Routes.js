import React from "react";
import { Route } from "react-router-dom";
import * as UseState from "../features/hooks/UseState";
import * as UseEffect from "../features/hooks/UseEffect";
import moduleIterator from "../utils/moduleIterator";
import "./Routes.css";

export default function Routes() {
  console.log(UseState);
  return (
    <>
      <Route
        path="/"
        exact
        component={() => <div>Welcome to this basic course on react</div>}
      />
      <Route
        exact
        path="/hooks/useState"
        component={moduleIterator(UseState)}
      />
      <Route
        exact
        path="/hooks/useEffect"
        component={moduleIterator(UseEffect)}
      />
    </>
  );
}
