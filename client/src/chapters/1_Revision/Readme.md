# Chapter 1 : Basic React Rendering

We’ll use this React app, just three lines of code. The first one defines a React element. The next one gets a node from the DOM. The last one renders the React element into the container.

```javascript
const element = <h1 title="foo">Hello</h1>;
const container = document.getElementById("root");
ReactDOM.render(element, container);
```

Let’s remove all the React specific code and replace it with vanilla JavaScript.

On the first line we have the element, defined with JSX. It isn’t even valid JavaScript, so in order to replace it with vanilla JS, first we need to replace it with valid JS.

JSX is transformed to JS by build tools like Babel. The transformation is usually simple: replace the code inside the tags with a call to createElement, passing the tag name, the props and the children as parameters.

```javascript
const element = React.createElement("h1", { title: "foo" }, "Hello");
const container = document.getElementById("root");
ReactDOM.render(element, container);
```

React.createElement creates an object from its arguments. Besides some validations, that’s all it does. So we can safely replace the function call with its output.

And this is what an element is, an object with two properties: type and props (well, it has more, but we only care about these two).

- The **type** is a string that specifies the type of the DOM node we want to create, it’s the tagName you pass to document.createElement when you want to create an HTML element. It can also be a function, but we’ll leave that for Step VII.

- **props** is another object, it has all the keys and values from the JSX attributes. It also has a special property: children.

- **children** in this case is a string, but it’s usually an array with more elements. That’s why elements are also trees.

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
​
const container = document.getElementById("root")
ReactDOM.render(element, container)
```

The other piece of React code we need to replace is the call to ReactDOM.render.

render is where React changes the DOM, so let’s do the updates ourselves.

First we create a node\* using the element type, in this case h1. Then we assign all the element props to that node. Here it’s just the title.

- To avoid confusion, I’ll use “element” to refer to React elements and “node” for DOM elements.

Then we create the nodes for the children. We only have a string as a child so we create a text node.

Using textNode instead of setting innerText will allow us to treat all elements in the same way later. Note also how we set the nodeValue like we did it with the h1 title, it’s almost as if the string had props: {nodeValue: "hello"}.

Finally, we append the textNode to the h1 and the h1 to the container.

```javascript
const element = {
  type: "h1",
  props: {
    title: "foo",
    children: "Hello",
  },
}
​
const container = document.getElementById("root")
​
const node = document.createElement(element.type)
node["title"] = element.props.title
​
const text = document.createTextNode("")
text["nodeValue"] = element.props.children
​
node.appendChild(text)
container.appendChild(node)
```