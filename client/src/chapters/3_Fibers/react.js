import { TEXT_ELEMENT_TYPE, TEXT_ELEMENT_VALUE_KEY } from "./constants";

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === "object") {
          return child;
        }
        return createTextElement(child);
      })
    }
  };
};

const createTextElement = text => {
  return {
    type: TEXT_ELEMENT_TYPE,
    props: {
      [TEXT_ELEMENT_VALUE_KEY]: text,
      children: []
    }
  };
};

export default { createElement };
