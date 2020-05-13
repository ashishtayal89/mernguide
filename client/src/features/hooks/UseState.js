import React, { useState } from "react";

// Here we are using a callback to set the state rather than a value.
export default function UseState() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

// Here we are using a callback to set the state rather than a value.
export function With_Callback() {
  const [count, setCount] = useState(() => 0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count => count + 1)}>Click me</button>
    </div>
  );
}

export function With_SideEffect() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  if (!count) {
    setCount(count + 1);
    setCount(
      count => count + 1,
      count => console.log(count) // This doen't work and throws a warning.
    );
  }
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export function With_Many_States() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(100);
  const [count3, setCount3] = useState(1000);
  console.log("Render");
  return (
    <div>
      <p>Count1 {count1}</p>
      <p>Count2 {count2}</p>
      <p>Count3 {count3}</p>
      <button
        onClick={() => {
          setCount1(count1 + 1);
          setCount2(count2 + 1);
          setCount3(count3 + 1);
        }}
      >
        Click me
      </button>
    </div>
  );
}