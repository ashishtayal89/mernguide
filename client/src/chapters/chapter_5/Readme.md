# Chapter 5 : Functional Component

In the previous chapter we learned about how to update dom only once and how to reconcile the dom creation to improve performance.
In this chapter we will cover functional components.

Function components are differents in two ways:

1. The fiber from a function component doesn’t have a DOM node.
2. The children come from running the function instead of getting them directly from the props.

So if the type of fiber is a function we don't add a dom node to the fiber and we generate children by calling that function.We achieve the above 2 points by the below code :

```javascript
const isFunctionComponent = fiber.type instanceof Function;
if (isFunctionComponent) {
  updateFunctionComponent(fiber);
} else {
  updateHostComponent(fiber);
}

const updateFunctionComponent = fiber => {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
};

const updateHostComponent = fiber => {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
};
```

After this we need to make some changes while we commit this fiber into the dom. These are :

1. **PLACEMENT** :
   - We only place the fibers which have a dom. Since the functional fiber doesn't have a dom it is ignored.
   - The child of the functional fiber having a dom needs to be placed. For this we find the first non functional fiber to this child and append its dom into it.
2. **DELETION** :
   - For a functional fiber we delete the first non functional child from the first non functional parent fiber.
3. **REPLACEMENT**
   There can be 4 cases for replacement. Replace :
   1. Html fiber with Functional fiber : We just remove the previous fiber dom from the parent.
   2. Functional fiber with Html fiber : We replace the dom of first non functional child fiber of the functional fiber with the dom of the Html fiber in the parent.
   3. Html fiber with Html fiber : We simply replace the dom node of the previous fiber with the current fiber in the parent.
   4. Functional fiber with Functional fiber : We don't need to do anything.
