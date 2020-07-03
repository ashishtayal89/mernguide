import { TEXT_ELEMENT_TYPE } from "../constants";

let wipRoot = null;
export const setWipRoot = value => (wipRoot = value);
export const getWipRoot = () => wipRoot;

let currentRoot = null;
export const getCurrentRoot = () => currentRoot;
export const setCurrentRoot = value => (currentRoot = value);

let deletions = null;
export const getDeletions = () => deletions;
export const setDeletions = list => (deletions = list);
export const addDeletions = value => deletions.push(value);

const isEvent = key => key.startsWith("on");
const isProperty = key => key !== "children" && !isEvent(key);
const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = next => key => !(key in next);

export const createDom = fiber => {
  const dom =
    fiber.type == TEXT_ELEMENT_TYPE
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = fiber.props[name];
    });

  return dom;
};

const updateDom = (dom, prevProps, nextProps) => {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });
  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(nextProps))
    .forEach(name => {
      dom[name] = "";
    });
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      dom[name] = nextProps[name];
    });
  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
};

const commitWork = fiber => {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "REPLACEMENT") {
    domParent.replaceChild(fiber.dom, fiber.alternate.dom);
  } else if (fiber.effectTag === "DELETION") {
    return domParent.removeChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

export const commitRoot = () => {
  const deletions = getDeletions();
  deletions.forEach(commitWork);
  const wipRoot = getWipRoot();
  commitWork(wipRoot.child);
  setCurrentRoot(wipRoot);
  setWipRoot(null);
};
