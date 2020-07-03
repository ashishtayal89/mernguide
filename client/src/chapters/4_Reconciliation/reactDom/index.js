import { getCurrentRoot } from "./dom";
import { init } from "./workloop";

export const render = (element, container) => {
  const firstUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: getCurrentRoot()
  };
  init(firstUnitOfWork);
};

export default { render };
