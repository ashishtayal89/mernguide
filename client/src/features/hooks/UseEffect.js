import React, { useEffect, useState, Component, useLayoutEffect } from "react";

export default function UseEffect() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export function With_Effect_CleanUp() {
  useEffect(() => {
    const intId = setInterval(() => console.log("effect"), 2000);
    return () => {
      clearInterval(intId);
    };
  });
  return (
    <div>
      Check the console and see the continuos loggin of effect which stop once
      we navigate to some other component
    </div>
  );
}

export class With_Class_CleanUp extends Component {
  constructor() {
    this.state = { count: 0 };
  }
  componentDidMount() {
    this.intId = setInterval(() => console.log("effect"), 2000);
  }
  componentWillUnmount() {
    clearInterval(this.intId);
  }
  render() {
    return (
      <div>
        Check the console and see the continuos loggin of effect which stop once
        we navigate to some other component
      </div>
    );
  }
}

export class With_Multiple extends Component {
  constructor() {
    this.state = { count: 0 };
  }
  componentDidMount() {
    this.intId = setInterval(() => console.log("effect"), 2000);
  }
  componentWillUnmount() {
    clearInterval(this.intId);
  }
  render() {
    const { count } = this.state;
    return (
      <>
        <span>Count : {count} </span>
        <button
          onClick={() => {
            this.setState({ count: count + 1 });
          }}
        >
          Upate counter
        </button>
        <p>Check the console for every click</p>
      </>
    );
  }
}

export function With_Effects_Lifecyle() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count === 0) {
      console.log("componentDidMount");
    } else {
      console.log("componentDidUpdate");
    }
    return () => {
      console.log("componentWillUnmount");
    };
  });
  console.log("render");
  return (
    <>
      <span>Count : {count} </span>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Upate counter
      </button>
      <p>Check the console for every click</p>
    </>
  );
}

export class With_ComponentDidMount extends Component {
  componentDidMount() {
    alert("Stop screen update");
  }
  render() {
    return <div>Rendered in Class</div>;
  }
}

export function With_Async_Effect() {
  useEffect(() => {
    alert("Stop screen update");
  });
  return <div>Rendered in Async Effect</div>;
}

export function With_Sync_Effect() {
  useLayoutEffect(() => {
    alert("Stop screen update");
  });
  return <div>Rendered in Sync Effect</div>;
}
