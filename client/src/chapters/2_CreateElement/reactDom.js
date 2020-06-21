import { TEXT_ELEMENT_TYPE } from "./constants";

const render = (element, container) => {
  const dom =
    element.type == TEXT_ELEMENT_TYPE
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = key =>
    key !== "children" && key !== "__self" && key !== "__source";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });
  container.appendChild(dom);
  element.props.children.forEach(child => render(child, dom));
};

export default { render };
