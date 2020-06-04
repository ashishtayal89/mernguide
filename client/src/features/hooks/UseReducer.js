import React, { useReducer } from "react";

//-----------------------------1-------------------------------------

const initialState = { count: 0 };

function reducer1(state, action) {
  debugger;
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function PassInitialState() {
  const [state, dispatch] = useReducer(reducer1, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}

//-----------------------------2-------------------------------------

// Some how react is not accepting this pattern. Need to check
// function reducer2(state = initialState, action) {
//   switch (action.type) {
//     case "increment":
//       return { count: state.count + 1 };
//     case "decrement":
//       return { count: state.count - 1 };
//     default:
//       throw state;
//   }
// }

// function PassStateInReducer() {
//   const [state, dispatch] = useReducer(reducer2, undefined, reducer2);
//   return (
//     <>
//       Count: {state.count}
//       <button onClick={() => dispatch({ type: "decrement" })}>-</button>
//       <button onClick={() => dispatch({ type: "increment" })}>+</button>
//     </>
//   );
// }

//-----------------------------3-------------------------------------

function reducer3(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return init(action.payload);
    default:
      throw new Error();
  }
}

function init(initialCount) {
  return { count: initialCount };
}

function LazyInitialState({ initialCount }) {
  const [state, dispatch] = useReducer(reducer3, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({ type: "reset", payload: initialCount })}
      >
        Reset
      </button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}

export const Counter1 = () => <PassInitialState />;
// export const Counter2 = () => <PassStateInReducer />;
export const Counter3 = () => <LazyInitialState initialCount={0} />;
