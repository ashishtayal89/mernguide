import React from "react";

class MyClass extends React.Component {
  constructor(props) {
    super(props);
  }

  alert() {
    alert("Alert in class");
  }

  render() {
    return <div>Click on the button to open alert in class.</div>;
  }
}

export class ClassRef extends React.Component {
  constructor(props) {
    super(props);
    this.myClassRef = React.createRef();
    this.handleAlert = this.handleAlert.bind(this);
  }

  handleAlert() {
    this.myClassRef.current.alert();
  }

  render() {
    return (
      <>
        <MyClass ref={this.myClassRef} />
        <button onClick={this.handleAlert}>Alert</button>
      </>
    );
  }
}
