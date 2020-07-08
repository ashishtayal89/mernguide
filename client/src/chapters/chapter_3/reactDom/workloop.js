import { performUnitOfWork } from "./fiber";

let nextUnitOfWork = null;

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

const init = firstUnitOfWork => {
  nextUnitOfWork = firstUnitOfWork;
  requestIdleCallback(workLoop);
};

export { init };
