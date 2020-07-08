import { performUnitOfWork } from "./fiber";
import { commitRoot, getWipRoot, setWipRoot, setDeletions } from "./dom";

let nextUnitOfWork = null;

export const init = firstUnitOfWork => {
  setWipRoot(firstUnitOfWork);
  setDeletions([]);
  nextUnitOfWork = getWipRoot();
  requestIdleCallback(workLoop);
};

const workLoop = deadline => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && getWipRoot()) {
    commitRoot();
  }
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  }
};
