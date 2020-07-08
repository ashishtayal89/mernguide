import { createDom, addDeletions } from "./dom";

const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  let prevSibling = null;

  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  if (wipFiber.effectTag === "REPLACEMENT") {
    oldFiber = null;
  }

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    if (!element && oldFiber) {
      // TODO delete the oldFiber's node
      oldFiber.effectTag = "DELETION";
      addDeletions(oldFiber);
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
    } else if (prevSibling) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }
};

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

export const performUnitOfWork = fiber => {
  // TODO Create DOM for fiber and Create new fiber from exiting fiber
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

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
