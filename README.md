# HOOKS

## Why hooks?

- **Reusable Statefull Logic** : This is one of the most important reasons for the introduction of hooks.Generally to reuse the statefull logic/ state of a component we make the use of **render props** or **HOC**. But in both the cases we change the architecure of our components either to abstract that logic(HOC) or reuse the logic(Render props). To resolve this difficulty react has introduced hooks which help us to separate the stateful logic from the components so that it can be reused amoung different components without any restructuring.

  `Motive : The motive here is to maintain the common state logic out of the components so that it can be reused without any structural changes.`

- **Complex class component becomes hard to understand** : We’ve often had to maintain components that started out simple but grew into an unmanageable mess of stateful logic and side effects. Each lifecycle method often contains a mix of unrelated logic. For example, components might perform some data fetching in componentDidMount and componentDidUpdate. So we are doing the same task of making api calls but in different lifecycle methods. However, the same componentDidMount method might also contain some unrelated logic that sets up event listeners, with cleanup performed in componentWillUnmount. In this case componentDidMount has api calls as well as code relating to event listeners which are 2 completely unrelated task at one place. Mutually related code that changes together gets split apart, but completely unrelated code ends up combined in a single method. This makes it too easy to introduce bugs and inconsistencies.

  `Motive : To keep all the related code like making api call etc at one place to avoid bugs and inconsistencies`

- **Classes can be difficult to understand** : In addition to making code reuse and code organization more difficult, we’ve found that classes can be a large barrier to learning React. You have to understand **how this works in JavaScript**, which is very different from how it works in most languages. You have to remember to bind the event handlers.The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.Additionally, React has been out for about five years, and we want to make sure **it stays relevant in the next five years**. [Ahead-of-time](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) compilation of components has a lot of future potential.Recently, we’ve been experimenting with [component folding](https://github.com/facebook/react/issues/7323) using [Prepack](https://prepack.io/), and we’ve seen promising early results.**Classes don’t minify very well, and they make hot reloading flaky and unreliable.**

  `Motive : All in all classed pose a challenge in the react ecosystem and otherwise in javascript itself. These chalenges are like understanding this, minification and hot reload issues and they also pose a challenge in the AOT compilation of code. So to resolve all these issue without taking away the functional power of classes, the hooks have been introduced.`

## Rules of Hooks

Hooks are JavaScript functions, but they impose two additional rules:

1. Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions. In other words hooks should be in the components functional scope and not inside some block(block scope) declared inside a component. This is also important so that you don't accidentally change the order of useState in-case you are using multiple useState effects. If you ignore this rule and add useState inside a conditional statement then the below error is thrown.
   `React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render`.
2. Only call Hooks from React function components. Don’t call Hooks from regular JavaScript functions. This is because react can only compile those hooks which are present in the functions it has access too ie the functions used as components. (There is just one other valid place to call Hooks — your own custom Hooks.)

## What are hooks

Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes.React provides a few built-in Hooks like useState. You can also create your own Hooks to reuse stateful behavior between different components.

## Types

### State Hooks

> useState

```javascript
import React, { useState } from "react";

export default function UseState() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  if (!count) {
    setCount(count + 1);
    setCount(
      count => count + 1,
      count => console.log(count) // This doen't work and thorws a warning.
    );
  }
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

Here `useState` is a hook.

- React will preserve this state between re-renders.
- useState returns a pair -> The current state value ie **count** and a function that lets you update it ie **setCount** in this case.
- You can call the setCount function from anywhere inside this function. Calling this function will re-render the react component.
- You can have multiple useState hooks in a component.React assumes that if you call useState many times, you do it in the same order during every render. Also react only re-renders the component once(batch update) even if we have multiple useState triggers.
- This setCount works exactly similar to `this.setState`(batch update and asynchronous) with a few differences :
  1. It doesn't merge the old and new state.
  2. It doesn't except a second callback for trigerring any sideeffect after setting the state. It throws the below waring if you try to do so
     `Warning: State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().`

### Effect Hooks

> useEffect

- **What are sideeffects or effects?** : You’ve likely performed data fetching, subscriptions, or manually changing the DOM from React components before. We call these operations “side effects” (or “effects” for short) because they can affect other components and can’t be done during rendering.
- The Effect Hook, useEffect, adds the ability to perform side effects from a function component. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.
- When you call useEffect, you’re telling React to run your “effect” function after flushing changes to the DOM.
- **Effects are declared inside the component so they have access to its props and state**.
- By default, **React runs the effects after every render — including the first render**.
- The useEffect hook accespts a callback. If we are to compare the effects callback with the class based lifecycle effects then
  1. The body of the useEffect callback acts like componentDidMount and componentDidUpdate combined.
  2. The return value of the useEffect callback acts like the componentWillUnmount lifecycle effect.

```javascript
```

## Additional Links

[RFC](https://github.com/reactjs/rfcs/pull/68)
[Dead-code elimination](https://en.wikipedia.org/wiki/Dead_code_elimination)

# CONTEXT
