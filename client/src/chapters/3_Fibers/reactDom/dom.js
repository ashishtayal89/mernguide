import { TEXT_ELEMENT_TYPE } from "../constants";
const create = fiber => {
  const dom =
    fiber.type == TEXT_ELEMENT_TYPE
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = key => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name];
    });

  return dom;
};

export { create };
