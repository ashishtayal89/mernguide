import React, { useState } from "./react";
import ReactDOM from "./reactDom";

function Counter() {
  const [state, setState] = useState(1);
  return <h4 onclick={() => setState(c => c + 1)}>Count: {state}</h4>;
}

const renderApp = () => {
  const element = (
    <div>
      <h2 title="child">Chapter 6 (Hooks)</h2>
      <Counter />
    </div>
  );
  ReactDOM.render(element, document.getElementById("chapter6"));
};

export default { renderApp };
