import React, { useImperativeHandle } from "react";

const MyFunction = React.forwardRef((_props, ref) => {
  useImperativeHandle(ref, () => ({
    alert: () => {
      alert("Alert in function");
    }
  }));

  return <div>Click on the button to open alert in function.</div>;
});

export class UseImperativeHandle extends React.Component {
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
        <MyFunction ref={this.myClassRef} />
        <button onClick={this.handleAlert}>Alert</button>
      </>
    );
  }
}
