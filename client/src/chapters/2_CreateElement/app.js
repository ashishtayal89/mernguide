import React from "./react";
import ReactDOM from "./reactDom";

const renderApp = () => {
  ReactDOM.render(
    <div id="parent">
      <h2 title="child">Chapter 2 (Create Element)</h2>
      <p>
        Here we are rendering the elements but we are also blocking the browser
        thread for important operation like user input and animation.
      </p>
    </div>,
    document.getElementById("chapter2")
  );
};

export default { renderApp };
