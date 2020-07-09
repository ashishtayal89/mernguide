# Chapter 6 : Hooks

In the previous chapter we learned about how to create a functional component.In this chapter we will cover on how to create hooks.
We will cover the **useState** hook which is used to maintain the state of a functinal component/element/fiber. Basically a component is converted to a element to a fiber.

For creating hook we keep 2 things in mind :

1. Every component instance will have its own hook.
2. There can be multiple hooks inside a component.

For this we change the way we create our fiber for a functional element. We create a variable **wipFiber** in our fiber.js file. The role of this variable is to store the work in progress functional fiber. This variable is then used in the useState method to access the current functinal fiber instance. Then we add the useState function :

This function returns 2 things :

1. The current state of the hook.
2. The method to updatee the state of the hook.

```javascript
let wipFiber = null;
let hookIndex = null;

export const useState = initial => {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = typeof action === "function" ? action(hook.state) : action;
  });

  const setState = action => {
    hook.queue.push(action);
    const currentRoot = getCurrentRoot();
    init({
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    });
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
};
```
