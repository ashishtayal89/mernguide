import React from "./react";
import ReactDOM from "./reactDom";

const renderApp = () => {
  ReactDOM.render(
    <div id="parent">
      <h2 title="child">Chapter 3 (Fibers)</h2>
      <p>
        Observe the delay in rendering of Chapter 2 and Chapter 3. This is
        because Chapter 3 is not blocking the thread for important and critical
        operation like animation and user input.
      </p>
    </div>,
    document.getElementById("chapter3")
  );
};

export default { renderApp };
