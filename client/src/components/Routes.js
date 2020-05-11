import React from "react";
import { Route } from "react-router-dom";
import * as UseState from "../features/hooks/UseState";
import UseEffect from "../features/hooks/UseEffect";
import moduleIterator from "./moduleIterator";

export default function Routes() {
  return (
    <>
      <Route
        exact
        path="/hooks/useState"
        component={moduleIterator(UseState)}
      />
      <Route exact path="/hooks/useEffect" component={UseEffect} />
    </>
  );
}
