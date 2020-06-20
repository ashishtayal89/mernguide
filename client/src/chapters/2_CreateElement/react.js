const TEXT_ELEMENT_TYPE = "TEXT_ELEMENT";
import { createElement } from "./react";
const TEXT_ELEMENT_VALUE_KEY = "nodeValue";

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
    type: TEXT_ELEMENT,
    props: {
      [TEXT_ELEMENT_VALUE_KEY]: text,
      children: []
    }
  };
};

export default { createElement };
