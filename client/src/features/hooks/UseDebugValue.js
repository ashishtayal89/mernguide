import React, { useDebugValue, useState } from "react";

const useStateWithLogger1 = props => {
  const [state, setState] = useState(props);
  console.log(state);
  useDebugValue("Initialized");
  return [state, setState];
};

export function Use_Debug_Value() {
  useStateWithLogger1(0);
  return (
    <div>
      Check out the dev tools to see <b>StateWithLogger1 : Debug</b> component
    </div>
  );
}

const useStateWithLogger2 = props => {
  const [state, setState] = useState(props);
  console.log(state);
  useDebugValue("Initialized", () =>
    state ? "Not Initilized" : "Initialized"
  );
  return [state, setState];
};

export function Use_Debug_Value_Callback() {
  useStateWithLogger2(0);
  return (
    <div>
      Check out the dev tools to see <b>StateWithLogger2 : Initialized</b>{" "}
      component
    </div>
  );
}
