import React from "./react";
import ReactDOM from "./reactDom";

const renderApp = update => {
  const element = update ? (
    <div id="parent2">
      <h2 title="child">Chapter 4 (Reconciliation)</h2>
      <span id="span1">span1</span>
      <div id="div2">div2</div>
      <span id="span2">span2</span>
    </div>
  ) : (
    <div id="parent2">
      <h2 title="child">Chapter 4 (Reconciliation)</h2>
      <div id="div1">div1</div>
      <div id="div2">div2</div>
    </div>
  );
  ReactDOM.render(element, document.getElementById("chapter4"));
};

export default { renderApp };

{
  /* <p>
        In this chapter we will learn about how to improve the user experience
        by updating the dom only once and preventing extra work by doing
        reconciliation
      </p>
      <ul>
        <li>
          The first difference in this chapter from chapter 3 is that in this we
          are updating the dom only once instead of updating it for each
          element.
        </li>
      </ul> */
}
