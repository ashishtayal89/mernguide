# About

This repo contains some basic concepts on hooks and context.

<details>

<summary><b>HOOKS</b></summary>

## Why hooks?

<details> 
<summary>Reusable Statefull Logic</summary>

This is one of the most important reasons for the introduction of hooks.Generally to reuse the statefull logic/ state of a component we make the use of **render props** or **HOC**. But in both the cases we change the architecure of our components either to abstract that logic(HOC) or reuse the logic(Render props). To resolve this difficulty react has introduced hooks which help us to separate the stateful logic from the components so that it can be reused amoung different components without any restructuring.

`Motive : The motive here is to maintain the common state logic out of the components so that it can be reused without any structural changes.`
`Hook instroduced : Custom Hook`

</details>

<details> 
<summary>Complex class component becomes hard to understand</summary>

We’ve often had to maintain components that started out simple but grew into an unmanageable mess of stateful logic and side effects. Each lifecycle method often contains a mix of unrelated logic. For example, components might perform some data fetching in componentDidMount and componentDidUpdate. So we are doing the same task of making api calls but in different lifecycle methods. However, the same componentDidMount method might also contain some unrelated logic that sets up event listeners, with cleanup performed in componentWillUnmount. In this case componentDidMount has api calls as well as code relating to event listeners which are 2 completely unrelated task at one place. Mutually related code that changes together gets split apart, but completely unrelated code ends up combined in a single method. This makes it too easy to introduce bugs and inconsistencies.

`Motive : To keep all the related code like making api call etc at one place to avoid bugs and inconsistencies`
`Hook introduced : Effect Hook`

</details>

<details> 
<summary>Classes can be difficult to understand</summary>

In addition to making code reuse and code organization more difficult, we’ve found that classes can be a large barrier to learning React. You have to understand **how "this" works in JavaScript**, which is very different from how it works in most languages. You have to remember to bind the event handlers.The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.Additionally, React has been out for about five years, and we want to make sure **it stays relevant in the next five years**. [Ahead-of-time](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) compilation of components has a lot of future potential.Recently, we’ve been experimenting with [component folding](https://github.com/facebook/react/issues/7323) using [Prepack](https://prepack.io/), and we’ve seen promising early results.**Classes don’t minify very well, and they make hot reloading flaky and unreliable.**

`Motive : All in all classed pose a challenge in the react ecosystem and otherwise in javascript itself. These chalenges are like understanding this, minification and hot reload issues and they also pose a challenge in the AOT compilation of code. So to resolve all these issue without taking away the functional power of classes, the hooks have been introduced.`

</details>

## Rules of Hooks

Hooks are JavaScript functions, but they impose two additional rules:

1. Only call Hooks at the top level. Don’t call Hooks inside loops, conditions, or nested functions. In other words hooks should be in the components functional scope and not inside some block(block scope) declared inside a component. By following this rule, you ensure that Hooks are called in the same order each time a component renders. That’s what allows React to correctly preserve the **state of Hooks** between multiple useState and useEffect calls. If you ignore this rule and add useState inside a conditional statement then the below error is thrown.
   `React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render`.
2. Only call Hooks from React function components. Don’t call Hooks from regular JavaScript functions. This is because react can only compile those hooks which are present in the functions it has access too ie the functions used as components. (There is just one other valid place to call Hooks — your own custom Hooks.)
   - Call Hooks from React function components.
   - Call Hooks from custom Hooks.

> Note : React released an ESLint plugin called [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) that enforces these two rules.This plugin is included by default in Create React App.

## What are hooks

Hooks are functions that let you “hook into” React state and lifecycle features from function components. Hooks don’t work inside classes — they let you use React without classes.React provides a few built-in Hooks like useState. Their names always start with **use**. You can also create your own Hooks to reuse stateful behavior between different components.

## When would I use a Hook?

If you write a function component and realize you need to add some state to it, previously you had to convert it to a class. Now you can use a Hook inside the existing function component.

## Types

<details>
<summary>State Hooks</summary>

> useState

- **Solves** :

  1. Maintains component state.

- **Class Counterpart** :

  1. `this.setState`

- **Difference from class** :

  It works exactly similar to `this.setState`(batch update and asynchronous) with a few differences :

  1. It doesn't merge the old and new state.
  2. It doesn't except a second callback for trigerring any sideeffect after setting the state. It throws the below waring if you try to do so
     `Warning: State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().`

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
  </details>

<details>
<summary>Effect Hooks</summary>

> useEffect

- **Solves** :

  1. It helps executes some sideeffect after dom rendering.
  2. Resolves **Complex class component becomes hard to understand** issue. So you can keep related code at one place.

- **Class Counterpart** :

  1. componentDidMount
  2. componentDidUpdate
  3. componentWillUnmount

- **Difference from class** :

  1. componentDidMount is render blocking but useEffect is not.

- **What are sideeffects or effects?** : You’ve likely performed data fetching, subscriptions, or manually changing the DOM from React components before. **We call these operations “side effects” (or “effects” for short) because they can affect other components and can’t be done during rendering**.
- The Effect Hook, useEffect, adds the ability to perform side effects from a function component. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.
- When you call useEffect, you’re telling React to run your “effect” function after flushing changes to the DOM.
- **Effects are declared inside the component so they have access to its props and state**.
- By default, **React runs the effects after every render — including the first render**.
- The useEffect hook accespts a callback. If we are to compare the effects callback with the class based lifecycle effects then
  1. The body of the useEffect callback acts like componentDidMount and componentDidUpdate combined.
  2. The return value of the useEffect callback acts like the componentWillUnmount lifecycle effect.
- **In the below example React would clearInterval when the component unmounts, as well as before re-running the effect due to a subsequent render**. This means that the useEffect return function is fired on each subsequent re-render.

  ```javascript
  import React, { useEffect } from "react";

  export default function UseEffect() {
    useEffect(() => {
      const intId = setInterval(() => console.log("effect"), 2000);
      return () => {
        clearInterval(intId);
      };
    });
    return (
      <div>
        {" "}
        Check the console and see the continuos loggin of effect which stop once
        we navigate to some other component
      </div>
    );
  }
  ```

- Note how **we have to duplicate the code between these two lifecycle methods in class**.

  ```javascript
  class Example extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        count: 0
      };
    }

    componentDidMount() {
      document.title = `You clicked ${this.state.count} times`;
    }
    componentDidUpdate() {
      document.title = `You clicked ${this.state.count} times`;
    }

    render() {
      return (
        <div>
          <p>You clicked {this.state.count} times</p>
          <button
            onClick={() => this.setState({ count: this.state.count + 1 })}
          >
            Click me
          </button>
        </div>
      );
    }
  }
  ```

  Solution with Hooks

  ```javascript
  import React, { useState, useEffect } from "react";

  function Example() {
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
  ```

- **What does useEffect do?** : By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed (we’ll refer to it as our “effect”), and call it later after performing the DOM updates. In this effect, we set the document title, but we could also perform data fetching or call some other imperative API.
- **Why is useEffect called inside a component?** Placing useEffect inside the component lets us access the count state variable (or any props) right from the effect. We don’t need a special API to read it — it’s already in the function scope. **Hooks embrace JavaScript closures** and avoid introducing React-specific APIs where JavaScript already provides a solution.
- **Why we pass a new function to useEffect every time?** : The function passed to useEffect is going to be different on every render. This is intentional. In fact, **this is what lets us read the count value from inside the effect without worrying about it getting stale**. Every time we re-render, we schedule a different effect, replacing the previous one. In a way, this makes the effects behave more like a part of the render result — each effect “belongs” to a particular render.
- Unlike componentDidMount or componentDidUpdate, effects scheduled with useEffect don’t block the browser from updating the screen. This makes your app feel more responsive. The majority of effects don’t need to happen synchronously. In the uncommon cases where they do (such as measuring the layout), there is a separate **useLayoutEffect** Hook with an API identical to useEffect.

  Try the below piece of code and see the difference between the 2. In case one we first see the alert and then react updates the screen. Whereas in the second case first react updates the screen and then we see the alert.

  > Note : You may call setState() immediately in componentDidMount(). It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the render() will be called twice in this case, the user won’t see the intermediate state. Use this pattern with caution because it often causes performance issues. In most cases, you should be able to assign the initial state in the constructor() instead. **It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position**. When you encounter such a situation where you need to stop the browser from updating tthe screen you should use **useLayoutEffect** instead of **useEffect**.

  ```javascript
  export class With_ComponentDidMount extends Component {
    componentDidMount() {
      alert("Stop screen update");
    }
    render() {
      return <div>Rendered</div>;
    }
  }

  export function WithOut_ComponentDidMount() {
    useEffect(() => {
      alert("Stop screen update");
    });
    return <div>Rendered</div>;
  }
  ```

- **Effect with CleanUp** : It is important to clean up so that we don’t introduce a **memory leak**.Notice how componentDidMount and componentWillUnmount need to mirror each other. Lifecycle methods force us to split this logic even though conceptually code in both of them is related to the same effect.

  ```javascript
  class FriendStatus extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isOnline: null };
      this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    componentDidMount() {
      ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }
    componentWillUnmount() {
      ChatAPI.unsubscribeFromFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }
    handleStatusChange(status) {
      this.setState({
        isOnline: status.isOnline
      });
    }

    render() {
      if (this.state.isOnline === null) {
        return "Loading...";
      }
      return this.state.isOnline ? "Online" : "Offline";
    }
  }
  ```

- **Effect with Cleanup using Hooks** : React performs the cleanup when the component unmounts. Effects run for every render and not just once. This is why React also cleans up effects from the previous render before running the effects next time.

  ```javascript
  import React, { useState, useEffect } from "react";

  function FriendStatus(props) {
    const [isOnline, setIsOnline] = useState(null);

    useEffect(() => {
      function handleStatusChange(status) {
        setIsOnline(status.isOnline);
      }
      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
      // Specify how to clean up after this effect:
      return function cleanup() {
        ChatAPI.unsubscribeFromFriendStatus(
          props.friend.id,
          handleStatusChange
        );
      };
    });

    if (isOnline === null) {
      return "Loading...";
    }
    return isOnline ? "Online" : "Offline";
  }
  ```

- **Use Multiple Effects to Separate Concerns** :
  **Hooks let us split the code based on what it is doing rather than a lifecycle method name**. React will apply every effect used by the component, in the order they were specified.Here is a component that combines the counter and the friend status indicator logic from the previous examples

  Using Class

  ```javascript
  class FriendStatusWithCounter extends React.Component {
    constructor(props) {
      super(props);
      this.state = { count: 0, isOnline: null };
      this.handleStatusChange = this.handleStatusChange.bind(this);
    }

    componentDidMount() {
      document.title = `You clicked ${this.state.count} times`;
      ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    componentDidUpdate() {
      document.title = `You clicked ${this.state.count} times`;
    }

    componentWillUnmount() {
      ChatAPI.unsubscribeFromFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    handleStatusChange(status) {
      this.setState({
        isOnline: status.isOnline
      });
    }
    // ...
  ```

  Using Effects

  ```javascript
  function FriendStatusWithCounter(props) {
    const [count, setCount] = useState(0);
    useEffect(() => {
      document.title = `You clicked ${count} times`;
    });

    const [isOnline, setIsOnline] = useState(null);
    useEffect(() => {
      function handleStatusChange(status) {
        setIsOnline(status.isOnline);
      }

      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(
          props.friend.id,
          handleStatusChange
        );
      };
    });
    // ...
  }
  ```

- **Why Effects Run on Each Update** : Lets understand by example. Our class reads friend.id from this.props, subscribes to the friend status after the component mounts, and unsubscribes during unmounting.

  ```javascript
    componentDidMount() {
      ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    componentWillUnmount() {
      ChatAPI.unsubscribeFromFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }
  ```

  But what happens if the friend prop changes while the component is on the screen? Our component would continue displaying the online status of a different friend. This is a bug. We would also cause a memory leak or crash when unmounting since the unsubscribe call would use the wrong friend ID.

  ```javascript
    componentDidMount() {
      ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    componentDidUpdate(prevProps) {
      // Unsubscribe from the previous friend.id
      ChatAPI.unsubscribeFromFriendStatus(
        prevProps.friend.id,
        this.handleStatusChange
      );
      // Subscribe to the next friend.id
      ChatAPI.subscribeToFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }

    componentWillUnmount() {
      ChatAPI.unsubscribeFromFriendStatus(
        this.props.friend.id,
        this.handleStatusChange
      );
    }
  ```

  For Effects there is no special code for handling updates because useEffect handles them by default.

  ```javascript
  function FriendStatus(props) {
    // ...
    useEffect(() => {
      // ...
      ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
      return () => {
        ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
      };
    });
  ```

- **Optimizing Performance by Skipping Effects** : In some cases, cleaning up or applying the effect after every render might create a performance problem. In class components, we can solve this by writing an extra comparison with prevProps or prevState inside componentDidUpdate. For useEffect pass an array as an optional second argument to useEffect.

  Using Class

  ```javascript
  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      document.title = `You clicked ${this.state.count} times`;
    }
  }
  ```

  Using Effect

  ```javascript
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // Only re-run the effect if count changes
  ```

  Effects that have a cleanup phase. Here it will fire only when props.friend.id change.

  ```javascript
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  }, [props.friend.id]); // Only re-subscribe if props.friend.id changes
  ```

  > Note : If you use this optimization, make sure the array includes all values from the component scope (such as props and state) that change over time and that are used by the effect. Otherwise, your code will reference stale values from previous renders.Learn more about [how to deal with functions](https://reactjs.org/docs/ hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) and [what to do when the array changes too often](https://reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).If you want to run an effect and clean it up only once (on mount and unmount), you can pass an empty array ([]) as a second argument. This tells React that your effect doesn’t depend on any values from props or state, so it never needs to re-run. This isn’t handled as a special case — it follows directly from how the dependencies array always works.If you pass an empty array ([]), the props and state inside the effect will always have their initial values. While passing [] as the second argument is closer to the familiar componentDidMount and componentWillUnmount mental model, there are usually better solutions to avoid re-running effects too often. **Also, don’t forget that React defers running useEffect until after the browser has painted, so doing extra work is less of a problem**.We recommend using the [exhaustive-deps](https://github.com/facebook/react/issues/14920) rule as part of our [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

  </details>
  <details>
  <summary>Callback Hook</summary>

> useCallback

- **Solves** :

  1. Prevents child component re-render due to new callback passed every time.

- **Class Counterpart** :

  1. Instance method of class

```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

Returns a memoized callback.
Pass an inline callback and an array of dependencies. useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. shouldComponentUpdate).

> **useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).**

> Use the **exhaustive-deps** rule as part of our eslint-plugin-react-hooks package.

</details>
<details>
<summary>Memo Hook</summary>

> useMemo

- **Solves**

  1. It helps memoize method response value based on input arguments.

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- useMemo will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.
- The function passed to useMemo runs during rendering.
- Side effects belong in useEffect, not useMemo.
- In the future, React may choose to “forget” some previously memoized values and recalculate them on next render, e.g. to free memory for offscreen components.
  </details>
  <details>
  <summary>Custom Hooks</summary>

> use[CustomName]

- **Solves**

  1. Helps us extract the similar state management logic to a common place/file.
  2. It helps us achieve **Reusable Statefull Logic** which was one of the key reasons for the introduction of hooks.

- **Earlier Counterparts**

  1. HOC
  2. Render Props

- **Difference from Earlier Counterparts**

  1. You don't need to maintain separate react component to abstract state logic at a common place/module/file.
  2. Custom Hooks offer the flexibility of sharing logic that wasn’t possible in React components before.

- **Basic Rule for Custom Hooks**

  1. Name of every custom hook should start with **use**, so that react can identify that the function is a hook.
  2. **Every call to a custom hook has its own isolated state**. So calling the same custom hook from 2 different components or the same component will create 2 isolated state.
  3. 2 components sharing same hook(custom hook) don't share the state.
  4. Every custom hook takes an input and returns an output.
  5. You can pass the result of one hook into another. This is general to all hooks not specific to custom hook.

- **Use Cases**
  When you have a logic to maintain and update the state of a component which is common across multiple components, we can use a custom hook. Eg :

  1. Form handling
  2. Animation
  3. Declarative Subscription
  4. Timers

- **Using custom hooks to create a useReducer hook**

This hook helps to manage the local state with a reducer. Its a pub sub pattern where you publish an action using dispatch and get notified on state update.

```javascript
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

| Parent Component                                         | HOC                                           | Render Props                                                                      |
| -------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| Parent Component is tightly coupled with child component | HOC accespts the child components to render   | Parent Component is not tightly coupled with child since child is passed as props |
| Used for parent/child relationship.                      | Used for abstracting some common logic        | Used for reusing some common logic in parent component.                           |
| Genrally made for specific use case in application       | Made so that it can be used throught the app. | Generally made when need to render different child using some common logic.       |

| HOC/Render Props                                                                        | Custom hook                                                               |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Common logic kept inside a common component which accepts diffrent components to render | Common logic is kept is file which is shared between different compoents. |

- **Rule of thumb for component state**

1. No 2 component instance can share the state without the use of an external factor like Redux or Parent Component.
2. When 2 componets share the state using a Parent Component is actully just using the state of an instance of component ie the Parent Component. Similary if they use Redux they are sharing the state using an instance of Redux store.
3. When we use a HOC, every call to a HOC creates a new instance of react component and hence a new state.
4. Similary when we use render props in 2 different components, we end up creating 2 separate states.
5. **On the same lines when we call a custom hook from 2 different components we end up creating 2 separate state of custom hook**.

</details>

<details>
<summary>Context Hooks</summary>

> useContext
> const value = useContext(MyContext);

- **Solves**

  1. Help us consume Context value passed by the Provider component.

- **Earlier Counterparts**

  1. Context.Consumer api for functional component.
  2. contextType api for class component.

- **Difference from Earlier Counterparts**

  1. In Context.Consumer only the component wrapped by the Consumer component gets re-rendered when the context value changes. But in the case of useContext() the whole componet gets re-rendered when the context value changes.If re-rendering the component is expensive, you can [optimize it by using memoization](https://github.com/facebook/react/issues/15156#issuecomment-474590693).

- **Basics**
  1. Accepts a context object (the value returned from React.createContext) and returns the current context value for that context.
  2. The current context value is determined by the value prop of the nearest <MyContext.Provider> above the calling component in the tree.
  3. When the nearest <MyContext.Provider> above the component updates, this Hook will trigger a rerender with the latest context value passed to that MyContext provider.
  4. Even if an ancestor uses React.memo or shouldComponentUpdate or PureComponent, a rerender will still happen starting at the component itself using useContext.

</details>

<details>
<summary>Reducer Hooks</summary>

> useReducer
> const [state, dispatch] = useReducer(reducer, initialArg, init);
> Accepts a **reducer** of type (state, action) => newState, and returns the current state paired with a dispatch method.

1. useReducer is usually preferable to useState when
   - there is complex state logic that involves multiple sub-values
   - next state depends on the previous one.
2. useReducer also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.

```javascript
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}
```

3.  **Initialize state** : There are 3 ways to initialize the state

    - **By passing initialState as 2nd argument to useReducer** :

      ```javascript
      const [state, dispatch] = useReducer(reducer, { count: initialCount });
      ```

    - **By providing it as default state to reducer function** :

      ```javascript
      function reducer(state = { count: 0 }, action) {
        switch (action.type) {
          case "increment":
            return { count: state.count + 1 };
          case "decrement":
            return { count: state.count - 1 };
          default:
            throw new Error();
        }
      }
      useReducer(reducer, undefined, reducer);
      ```

      > React doesn’t use the state = initialState argument convention popularized by Redux. The initial value sometimes needs to depend on props and so is specified from the Hook call instead. If you feel strongly about this, you can call useReducer(reducer, undefined, reducer) to emulate the Redux behavior, but it’s not encouraged.

    - **Lazy state initialization**
      You can also create the initial state lazily. To do this, you can pass an **init** function as the third argument. The initial state will be set to **init(initialArg)**.

      1. It lets you extract the logic for calculating the initial state outside the reducer.
      2. This is also handy for resetting the state later in response to an action as done on reset in the below example

         ```javascript
         function init(initialCount) {
           return { count: initialCount };
         }

         function reducer(state, action) {
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

         function Counter({ initialCount }) {
           const [state, dispatch] = useReducer(reducer, initialCount, init);
           return (
             <>
               Count: {state.count}
               <button
                 onClick={() =>
                   dispatch({ type: "reset", payload: initialCount })
                 }
               >
                 Reset
               </button>
               <button onClick={() => dispatch({ type: "decrement" })}>
                 -
               </button>
               <button onClick={() => dispatch({ type: "increment" })}>+</button>
             </>
           );
         }
         ```

4.  **Bailing out of a dispatch** : If you return the same value from a Reducer Hook as the current state, React will - bail out without rendering the children or firing effects. (React uses the Object.is comparison algorithm.) - still need to render that specific component again before bailing out. That shouldn’t be a concern because React won’t unnecessarily go “deeper” into the tree. If you’re doing expensive calculations while rendering, you can optimize them with useMemo.

</details>

<details>
<summary>Ref Hooks</summary>

> const refContainer = useRef(initialValue);

> useRef **returns a mutable ref object** whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.

Look at the below example to look at the implemention of useRef.

```javascript
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

However, useRef() is useful for more than the ref attribute. **It’s handy for keeping any mutable value around** similar to how you’d use **instance fields in classes**. This works because useRef() creates a plain JavaScript object. The only difference between useRef() and creating a {current: ...} object yourself is that useRef will give you the same ref object on every render.

| Class Intance Variable/useRef | State/useState      |
| ----------------------------- | ------------------- |
| Mutable                       | Immutable           |
| No re-render on update        | Re-render on update |

</details>

<details>
<summary>Imperative Handle Hooks</summary>

> useImperativeHandle(ref, createHandle, [deps])

useImperativeHandle customizes the instance value that is exposed to parent components when using ref.Imperative code using refs should be avoided in most cases. useImperativeHandle should be used with forwardRef:

```javascript
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

</details>

<details>
<summary>Layout Effect Hooks</summary>

> useLayoutEffect

The signature is identical to useEffect, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside useLayoutEffect will be flushed synchronously, before the browser has a chance to paint.
Due to its synchronous nature this effect prevents the browser from painting the dom.

> If you’re migrating code from a class component, note useLayoutEffect fires in the same phase as componentDidMount and componentDidUpdate. However, we recommend starting with useEffect first and only trying useLayoutEffect if that causes a problem.

> If you use server rendering, keep in mind that neither useLayoutEffect nor useEffect can run until the JavaScript is downloaded. This is why React warns when a server-rendered component contains useLayoutEffect. To fix this, either move that logic to useEffect (if it isn’t necessary for the first render), or delay showing that component until after the client renders (if the HTML looks broken until useLayoutEffect runs).To exclude a component that needs layout effects from the server-rendered HTML, render it conditionally with `showChild && <Child />` and defer showing it with `useEffect(() => { setShowChild(true); }, [])`. This way, the UI doesn’t appear broken before hydration.

</details>

<details>
<summary>Debug Value Hooks</summary>

> useDebugValue(value)

- useDebugValue can be used to display a label for custom hooks in React DevTools.
- It’s most valuable for custom Hooks that are part of shared libraries.

```javascript
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? "Online" : "Offline");

  return isOnline;
}
```

- **Defer formatting debug values**
  In some cases formatting a value for display might be an expensive operation. It’s also unnecessary unless a Hook is actually inspected.
  For this reason **useDebugValue accepts a formatting function as an optional second parameter**. **This function is only called if the Hooks are inspected**. It receives the debug value as a parameter and should return a formatted display value.

  ```javascript
  useDebugValue(date, date => date.toDateString());
  ```

</details>

## Additional Links

[RFC](https://github.com/reactjs/rfcs/pull/68)
[Dead-code elimination](https://en.wikipedia.org/wiki/Dead_code_elimination)

</details>

<details>
<summary><b>CONTEXT</b></summary>

In a typical React application, data is passed top-down (parent to child) via props, but this can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.

### Use Case

Whenever in an application there is a situation where you need to pass props through multiple level of heirarchy and the props are being used in multiple compoenents, it is an ideal situation to make use of Context api. Eg

1. Current authenticated user
2. Theme
3. Selected Language
4. Viewport Change
5. Data Cache

### Limitations

We should use Context api sparingly since it makes the re-use of component more difficult.

### Other Alternatives

<details>
<summary>Inversion of control using composition</summary>

For example, consider a Page component that passes a user and avatarSize prop several levels down so that deeply nested Link and Avatar components can read it:

```javascript
  <Page user={user} avatarSize={avatarSize} />
  // ... which renders ...
  <PageLayout user={user} avatarSize={avatarSize} />
  // ... which renders ...
  <NavigationBar user={user} avatarSize={avatarSize} />
  // ... which renders ...
  <Link href={user.permalink}>
    <Avatar user={user} size={avatarSize} />
  </Link>
```

One way to solve this issue without context is to pass down the Avatar component itself so that the intermediate components don’t need to know about the user or avatarSize props:

```javascript
  function Page(props) {
    const user = props.user;
    const userLink = (
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    );
    return <PageLayout userLink={userLink} />;
  }

  // Now, we have:
  <Page user={user} avatarSize={avatarSize} />
  // ... which renders ...
  <PageLayout userLink={...} />
  // ... which renders ...
  <NavigationBar userLink={...} />
  // ... which renders ...
  {props.userLink}
```

However, this isn’t the right choice in every case: moving more complexity higher in the tree makes those higher-level components more complicated and forces the lower-level components to be more flexible than you may want.**You can take it even further with render props if the child needs to communicate with the parent before rendering.**

</details>

### APIs

<details>
<summary>React.createContext</summary>

> const MyContext = React.createContext(defaultValue);

- Creates a Context object.
- When React renders a component that subscribes to this Context object it will read the current context value from the closest matching Provider above it in the tree.
- The defaultValue argument is only used when a component does not have a matching Provider above it in the tree. This can be helpful for testing components in isolation without wrapping them. Check this out in `DefaultValue.js` file.
- Passing undefined as a Provider value does not cause consuming components to use defaultValue.

</details>

<details>
<summary>Context.Provider</summary>

- Every Context object comes with a **Provider React component** that allows consuming components to subscribe to context changes.
- Accepts a **value prop** to be passed to consuming components that are descendants of this Provider.
- One Provider can be connected to **many consumers**.
- Providers can be **nested to override** values deeper within the tree.
- All consumers that are descendants of a Provider will **re-render whenever the Provider’s value prop changes**.
- The propagation from Provider to its descendant consumers (including .contextType and useContext) is not subject to the shouldComponentUpdate method, so **the consumer is updated even when an ancestor component skips an update**.
- Changes are determined by comparing the new and old values using the same algorithm as **Object.is** ie shalow comparison.This can cause some issues when passing objects as value. For example, the code below will re-render all consumers every time the Provider re-renders because a new object is always created for value :

  ```javascript
  class App extends React.Component {
    render() {
      return (
        <MyContext.Provider value={{ something: "something" }}>
          <Toolbar />
        </MyContext.Provider>
      );
    }
  }
  ```

  To get around this, lift the value into the parent’s state:

  ```javascript
  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: { something: "something" }
      };
    }

    render() {
      return (
        <Provider value={this.state.value}>
          <Toolbar />
        </Provider>
      );
    }
  }
  ```

</details>

<details>
<summary>Class.contextType</summary>

- The contextType property on a class can be assigned a Context object created by React.createContext()
- This lets you consume the nearest current value of that Context type using **this.context**.
- You can reference this in any of the lifecycle methods including the render function.

  ```javascript
  class MyClass extends React.Component {
    componentDidMount() {
      let value = this.context;
      /* perform a side-effect at mount using the value of MyContext */
    }
    componentDidUpdate() {
      let value = this.context;
      /* ... */
    }
    componentWillUnmount() {
      let value = this.context;
      /* ... */
    }
    render() {
      let value = this.context;
      /* render something based on the value of MyContext */
    }
  }
  MyClass.contextType = MyContext;
  ```

- You can **only subscribe to a single context** using this API.
- For **Consuming Multiple Contexts** you need to use the **Context.Consumer** component of context object.

</details>

<details>
<summary>Context.Consumer</summary>

```javascript
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

- A React component that subscribes to context changes.
- This lets you subscribe to a context within a function component.
- This component requires a function as a child which receives the current context value and returns a React node.
- The value argument passed to the function will be equal to the value prop of the closest Provider for this context above in the tree.
- If there is no Provider for this context above, the value argument will be equal to the defaultValue that was passed to createContext().

</details>

<details>
<summary>Context.displayName</summary>

- Context object accepts a displayName string property. React DevTools uses this string to determine what to display for the context.
- For example, the following component will appear as MyDisplayName in the DevTools:

  ```javascript
  const MyContext = React.createContext(/* some value */);
  MyContext.displayName = 'MyDisplayName';

  <MyContext.Provider> // "MyDisplayName.Provider" in DevTools
  <MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
  ```

</details>

### Examples

<details>
<summary>Consuming Multiple Context</summary>

```javascript
// Theme context, default to light theme
const ThemeContext = React.createContext("light");

// Signed-in user context
const UserContext = React.createContext({
  name: "Guest"
});

class App extends React.Component {
  render() {
    const { signedInUser, theme } = this.props;

    // App component that provides initial context values
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Layout />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// A component may consume multiple contexts
function Content() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => <ProfilePage user={user} theme={theme} />}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}
```

</details>

</details>

<details>
<summary> <b>REF</b></summary>

### Why ref?

In the typical React dataflow, props are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively modify a child outside of the typical dataflow. The child to be modified could be an instance of a React component, or it could be a DOM element. For both of these cases, React provides an escape hatch ie ref. Few use cases :

- Get elements position and dimension to do some task.
- Integration with third party dom library.
- Trigger Imperative animations
- Managing focus, text selection.

### When is a ref attached?

- Class component : After render but before componentDidMount
- Function component : Before the exection of useEffect callback.

### Different Types of ref

1. **ref to a DOM element**
   When the ref attribute is used on an HTML element, the ref receives the underlying DOM element as its current property.
2. **ref to a React class component**
   When the ref attribute is used on a custom class component, the ref object receives the mounted instance of the component as its current property. Note that the below code only works if `CustomTextInput` is declared as a class:

   Here we use a ref to get access to the CustomTextInput and call its focusTextInput method manually

   ```javascript
   class AutoFocusTextInput extends React.Component {
     constructor(props) {
       super(props);
       this.textInput = React.createRef();
     }
     componentDidMount() {
       this.textInput.current.focusTextInput();
     }
     render() {
       return <CustomTextInput ref={this.textInput} />;
     }
   }

   class CustomTextInput extends React.Component {
     focusTextInput() {}
     // ...
   }
   ```

3. **ref to a React functional component** :
   Although you may not use the ref attribute on function components by default as they don’t have instances, but you can achieve this using `forwardRef` in conjunction with `useImperativeHandle`.

   ```javascript
   function FancyInput(props, ref) {
     const inputRef = useRef();
     useImperativeHandle(ref, () => ({
       focus: () => {
         inputRef.current.focus();
       }
     }));
     return <input ref={inputRef} ... />;
   }
   FancyInput = forwardRef(FancyInput);
   ```

### Ways to add ref

To add a ref you access the ref attribute of an element(Dom,Class,Functional). You can pass either an **object** or a **function** to this attribute. If you pass an object(createRef,useRef) the element reference is assigned to the **current** property of the object. If you pass a function(callback ref) the element reference is passed as the first argument of the function. There is another option to pass a string in the ref attribute but it is legacy now and should not be used.

> It will also work if you just pass any other object in ref attribute instead of React.createRef but it will throw a warning.

<details>
<summary> <b>createRef api</b></summary>

> Create : React.createRef

> Access : this.textInput.current

> Use In : Class Components. But can also be used in functional component.

Refs are created using `React.createRef()` and attached to React elements via the `ref` attribute. Refs are commonly assigned to an instance property when a component is constructed so they can be referenced throughout the component.

```javascript
class CreateRef extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    this.textInput.current.focus();
  }

  componentDidMount() {
    this.focusTextInput();
  }

  render() {
    return (
      <div>
        <input type="text" ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

</details>

<details>
<summary> <b>callback as ref</b></summary>

> Create : using callback

> Access : this.textInput.current

> Use In : Class component. But can also be used in functional component.

Instead of passing a ref attribute created by createRef(), you pass a function. The function receives the React component instance or HTML DOM element as its argument, which can be stored and accessed elsewhere.

React will call the ref callback with the DOM element when the component mounts, and call it with null when it unmounts. Refs are guaranteed to be up-to-date before componentDidMount or componentDidUpdate fires.

```javascript
export class CallbackRef extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    this.focusTextInput();
  }

  render() {
    return (
      <div>
        <input type="text" ref={this.setTextInputRef} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

> If the ref callback is defined as an inline function, it will get called twice during updates, first with null and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the ref callback as a bound method on the class, but note that it shouldn’t matter in most cases.

</details>

<details>
<summary> <b>useRef hook</b></summary>

> Create : useRef hook Eg const textInput = useRef(null)

> Access : textInput

> Use In : Functional Components, but can also be used in class components.

useRef is a hook introduced to access ref in a functional component as well. You can create a custom useRef hook also by using React.createRef and useState api.
useRef returns a mutable ref object whose .current property is initialized to the passed argument (initialValue). The returned object will persist for the full lifetime of the component.

```javascript
export const UseRef = () => {
  const textInput = useRef(null);
  const focusTextInput = () => textInput.current.focus();
  useEffect(() => {
    focusTextInput();
  }, []);
  return (
    <div>
      <input type="text" ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={focusTextInput}
      />
    </div>
  );
};
```

</details>

<details>
<summary> <b>legacy ref as string</b></summary>

> Create : string Eg ref="textInput"

> Access : this.ref.textInput

> Use In : Class Components

This is a legacy way to add refs. The ref attribute is a string, like "textInput", and the DOM node is accessed as this.refs.textInput. **We advise against it because string refs have some issues, are considered legacy**, and are likely to be removed in one of the future releases.

</details>

### Ways to Forwarding ref

Sometimes we need our parent ref to have access to some dom node of its child. For this reason we need a mechanism to forward the ref of the parent to the child. This can be done by the below 2 techniques.

**Why** : React components hide their implementation details, including their rendered output. Other components using FancyButton usually will not need to obtain a ref to the inner button DOM element. This is good because it prevents components from relying on each other’s DOM structure too much.
Although such encapsulation is desirable for application-level components like FeedStory or Comment, it can be inconvenient for highly reusable “leaf” components like FancyButton or MyTextInput. These components tend to be used throughout the application in a similar manner as a regular DOM button and input, and accessing their DOM nodes may be unavoidable for managing focus, selection, or animations.

1. **Forwarding createRef or useRef using forwardRef**

React passes the ref to the (props, ref) => ... function inside forwardRef as a second argument.The second ref argument only exists when you define a component with React.forwardRef call. Regular function or class components don’t receive the ref argument, and ref is not available in props either.

In the example below, FancyButton uses React.forwardRef to obtain the ref passed to it, and then forward it to the DOM button that it renders:

```javascript
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

2. **Forwarding callback Ref**
   Here we pass a function as a props to the child component which is used as a callback ref in the child component. This callback is then assigned as the ref attribute of one of the elements in the child component, which enable us to access this element in the parent component.

   ```javascript
   function CustomTextInput(props) {
     return (
       <div>
         <input ref={props.inputRef} />
       </div>
     );
   }

   class Parent extends React.Component {
     render() {
       return <CustomTextInput inputRef={el => (this.inputElement = el)} />;
     }
   }
   ```

   > When you start using forwardRef in a component library, you should treat it as a breaking change and release a new major version of your library. This is because your library likely has an observably different behavior (such as what refs get assigned to, and what types are exported), and this can break apps and other libraries that depend on the old behavior. Conditionally applying React.forwardRef when it exists is also not recommended for the same reasons: it changes how your library behaves and can break your users’ apps when they upgrade React itself.

</details>
