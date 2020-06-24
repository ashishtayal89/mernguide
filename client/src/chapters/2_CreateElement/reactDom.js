import { TEXT_ELEMENT_TYPE } from "./constants";

const render = (element, container) => {
  // Create DOM node
  const dom =
    element.type == TEXT_ELEMENT_TYPE
      ? document.createTextNode("")
      : document.createElement(element.type);

  // Assign props to each node
  const isProperty = key =>
    key !== "children" && key !== "__self" && key !== "__source";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });

  // Iterate over all the children and render them
  element.props.children.forEach(child => render(child, dom));

  // Add the newly created dom to their parent.
  container.appendChild(dom);
};

export default { render };
