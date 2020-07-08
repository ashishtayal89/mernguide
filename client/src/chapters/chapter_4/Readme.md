# Chapter 4 : Reconciliation

In the previous chapter we learned about how to create the dom in an async manner to prevent the blowing of browser thread. But we still have an issue with it. We are recursively updating the browser dom. This lead to an unpleasant user experience where the user is able to see incomplete UI. Also we are creating a completely new dom tree on every render cycle instead of updating the exiting dom for the newly created/update/deleted elements.

This chapter will include 2 parts :

1. Creating the dom after the fiber chain is complete.
2. Updating the dom for re-render using reconciliation.

## Creating the dom after the fiber chain is complete

For this we remove the code in our `performUnitOfWork` function which is responsible to update the dom. Changes :

```javascript
// Removed
if (fiber.parent) {
  fiber.parent.dom.appendChild(fiber.dom);
}
```

Then we create a new function `commitRoot` in our `dom` library which is responsible to commit the root fiber which we have created into the browser dom. In other words its the responsibility of this function to create the dom from our newly created fiber. It is only done after the fiber is complete or there is no unit of work left to be done.

## Updating the dom for re-render using reconciliation

One of the most important feature of react is to update only the portion of dom which has undergone some change instead of creating a completely new dom.**To achieve this we would need the previous element/fiber state to compare it with the current element/fiber state to determine the status(update,deletion etc) of the newly created fiber.**

For this we create 3 variable in the dom api :

1. **wipRoot** -> This is the work in progress root. This is the root fiber which is created on every successive ReactDOM.render.
2. **currentRoot** -> This is the root fiber of the previously created dom.
3. **deletions** -> This is a collection of fiber which needs to be removed from the dom.

The process of finding out the difference and then updating the dom is called diffing and reconciliation. We handle this in the fiber apis `reconcileChildren` function. For this we need an additional property in every fiber called `alternate` which stores the previously created fiber corresponding to the new fiber. This function accespts 2 arguments

1. **wipFiber** -> This is the fiber from which we need to create new fibers. We use this fiber to get the first oldFiber. The alternate gives us the previous fiber corresponding to the wipfiber. By getting its child we get the old fiber created for the current child element.

```javascript
wipFiber.alternate && wipFiber.alternate.child;
```

2. **elements** -> These are the new child elements to the current fiber. This is used to iterate and create a new fiber. The type of this element is compared with the corresponding old fiber to determine if the element is still the same or has been changed. This helps in determining the state of the newly created fiber.

### Fiber states

1. **Placement** : This is the case when we have an element but we don't have any oldFiber corresponding to that element. All the fibers created on the first render have this state. On every successive render the elements pushed as a new child also have this state.
2. **Deletion** : This in the case when we have an oldFiber but we don't have any element corresponding to that oldFiber. This is generaly the case we remove some element from the end of the child array. In this case we don't create a new fiber corresponding to the oldFiber, instead we push the previous fiber to an array of fibers to be deleted from the dom.
3. **Replacement** : This is the case when we have both element and the oldFiber corresponding to it but their type is not the same.This is the case when we replace a child element with an element of some other type.
4. **Update** : This is the case when we have both element and the oldfiber of the same type. In such case we just look for the updates on current element.

> Note : How we assing oldFiber to null if `wipFiber.effectTag === "REPLACEMENT"`. This is done because we don't want to compare the child types if the parent has been replaced. We want to create new fiber with state as `PLACEMENT` if the parent has been replaced.

Finaly when there is no work left we commit the wipRoot fiber into the dom. This is done using the **commitRoot** dom api.
It does the below task in order :

1. Deletes the fibers in deletions array from the dom.
2. Commits the newly created fiber into the dom : This is the place where the state of the fiber is indentified and correspondinglly the dom node is created, replaced or updated.
3. Sets the currentRoot to the newly created wipRoot fiber.
4. Sets the wipRoot fiber to null.
