import React from "react";
import { Route } from "react-router-dom";
import features from "./appFeatures";

import "./Routes.css";

export default function Routes() {
  return (
    <>
      {features.map(({ route, component }) => (
        <Route path={route} exact component={component} />
      ))}
    </>
  );
}
