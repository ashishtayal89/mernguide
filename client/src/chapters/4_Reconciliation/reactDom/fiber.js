import { createDom, addDeletions } from "./dom";

const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  let isReplaced = wipFiber.effectTag && wipFiber.effectTag === "REPLACEMENT";
  let oldFiber = isReplaced
    ? null
    : wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    if (!element && oldFiber) {
      // TODO delete the oldFiber's node
      oldFiber.effectTag = "DELETION";
      addDeletions(oldFiber);
      //   newFiber = {
      //     type: oldFiber.type,
      //     props: oldFiber.props,
      //     alternate: oldFiber,
      //     dom: oldFiber.dom,
      //     parent: oldFiber.parent,
      //     effectTag: "DELETION"
      //   };
    }

    if (element && !oldFiber) {
      // TODO add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }

    // If the previous fiber has been replaced or updated check for its type
    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      // TODO update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }
    if (element && oldFiber && !sameType) {
      // TODO replace this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "REPLACEMENT"
      };
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
};

export const performUnitOfWork = fiber => {
  // TODO Create DOM for fiber
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // TODO Create new fiber from exiting fiber
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  // TODO Return next unit of work or fiber
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;

  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
};
