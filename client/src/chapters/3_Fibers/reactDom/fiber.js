import { create } from "./dom";

const performUnitOfWork = fiber => {
  // 1. Create a dom and append it to parent dom
  if (!fiber.dom) {
    fiber.dom = create(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  // 2. If there is a child create a new fiber and assign as the child of current fiber.
  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];
    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  // 3. Return fiber/nextUnitOfWork with the priorty order -> 1.child  2.sibling  3.parent sibling
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

export { performUnitOfWork };
