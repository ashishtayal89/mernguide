import React, { useState } from "./react";
import ReactDOM from "./reactDom";

function Counter() {
  const [state, setState] = useState(1);
  return <h1 onclick={() => setState(c => c + 1)}>Count: {state}</h1>;
}

const renderApp = () => {
  const element = <Counter />;
  ReactDOM.render(element, document.getElementById("chapter6"));
};

export default { renderApp };
