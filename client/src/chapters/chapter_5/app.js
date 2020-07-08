import React from "./react";
import ReactDOM from "./reactDom";

const DisplayAddress = ({ house, street, pincode }) => (
  <span>{`${house}, ${street} - ${pincode}`}</span>
);

const DisplayDetails = ({ name, address, age, gender }) => (
  <div>
    <div>Details :</div>
    <ul>
      <li>Name : {name}</li>
      <li>Age : {age}</li>
      <li>Gender : {gender}</li>
      <li>
        Address : <DisplayAddress {...address} />
      </li>
    </ul>
  </div>
);

const renderApp = update => {
  const element = update ? (
    <div id="parent2">
      <h2 title="child">Chapter 5 (Functional Component)</h2>
      <span id="span1">span1</span>
      <div id="div2">div2</div>
      <span id="span2">span2</span>
    </div>
  ) : (
    <div id="parent2">
      <h2 title="child">Chapter 5 (Functional Component)</h2>
      <DisplayDetails
        name="Ashish"
        address={{ house: "B-22", street: "aurobindo marg", pincode: 110017 }}
        age={30}
        gender="M"
      />
    </div>
  );
  ReactDOM.render(element, document.getElementById("chapter5"));
};

export default { renderApp };
