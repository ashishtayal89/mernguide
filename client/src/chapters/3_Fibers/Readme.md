# Chapter 3 : Creating units of work using fiber.

In the previous chapter we did below two tasks :

1. Convert our html to an element object with 2 properties **type** and **props**.
2. Convert this element tree into dom tree and append it to the container.

But there is an issue with this approach. We are creating the dom tree in a syncronous manner. If the number of node are hug like 10000, this can lead to blocking the JS engine thread which can intern lead to bigger issues like blocking user interaction with the site or in other words making the site non-responsive for some time. To solve this issue we need to break the process of building this dom tree into smaller units of work and perform them asynchonously therefore not blocking the browser thread. For this purpose we convert each `element` into a `fiber`.

A **fiber** is an object which has a reference to 3 more objects. Namely :

1. Parent
2. Child
3. Sibling

Example of a fiber object is :

```json
{
  "type": ..., // This is a string defining the type of fiber. (element.type)
  "props": ..., // This is an object with all the props of the element (element.props). It also contains the children which contains an array of child elements.
  "parent": ..., // This refers to its parent fiber.
  "child": ..., // This refers to its child fiber.
  "sibling": ..., // This refers to its immidiate next sibling fiber.
  "dom" ... // This is the dom node for this fiber.
}
```

## Steps for converting the sync dom creation into async dom creation.

1. Convert the root container into a fiber. This fiber will be our first unit of work. This is done in our render method. The firstUnitOfWork is the fiber we create for the root container.

```javascript
nextUnitOfWork = {
  dom: container,
  props: {
    children: [element]
  }
};
```

2. We create an async loop which will process and perform this next unit of work whenever the thread is free to do so. For this we use `window.requestIdleCallback`. This is a browser api which queues a function to be called during a browser's idle periods. The function passed to this is a `workloop` whose purpose in to keep doning the next unit of work till the browser is free or the next unit of work is empty. If the browser is not free then wait for it to be free and start over again.

```javascript
const workLoop = deadline => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  }
};
```

3. Then we create a function to perform the next unit of work. There are 3 steps in performing the next unit of work :

   1. If the fiber doesn't have dom then create one and assing it as the fiber dom property. Then see if it has a parent and append this dom to its parent dom.
   2. If the fiber has children elements in its props then covert all these elements into fibers link them to create a chain. This is nothing but converting an array of elements into a **link-list** of fibers. This newly created fiber chain is then assigned as the **child** property to the fiber.
      `[element1, element2, element3] to fiber1->fiber2->fiber3`
   3. Lastly it check for the next "unit of work" or "fiber" and return it. The priority for next unit of work is
      1. child fiber
      2. sibling
      3. parent->sibling(Till the time it finds one);
