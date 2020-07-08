import { init } from "./workloop";

const render = (element, container) => {
  const firstUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  };
  init(firstUnitOfWork);
};

export default { render };
