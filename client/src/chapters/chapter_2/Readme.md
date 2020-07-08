# Chapter 2 : Create Element

This section contains 2 parts:

1. Create Element using react
2. Render Element using ReactDOM

## Create Element using react

1. In **app.js** we import `React`.

```javascript
import React from "./react";
```

This is our react library which contains a function createElement responsible for creating elements. Elements are nothing but objects with the below structure.

```json
// element
{
  "type": "",
  "props": {
    "children": [] // Array of child elements
  }
}
```

2. `Babel` converts our HTML into React.createElement.

```javascript
<div id="parent">
  <h2 title="child">Chapter 2 (Create Element)</h2>
</div>
```

to

```javascript
React.createElement(
  "div",
  { id: "parent" },
  React.createElement("h2", { title: "child" }, "c")
);
```

3. This is converted by createElement into below object

```json
{
  "type": "div",
  "props": {
    "id": "parent",
    "children": [
      {
        "type": "h2",
        "props": {
          "title": "child",
          "children": [
            {
              "type": "TEXT_ELEMENT",
              "props": {
                "nodeValue": "Chapter 2 (Create Element)"
              }
            }
          ]
        }
      }
    ]
  }
}
```

## Render Element using ReactDOM

The purpose of **ReactROM** is to convert this into dom tree and add it to the container.

1. We invoke `ReactDOM.render` which accepts 2 arguments.
   - element : The object representation of the HTML.
   - container : The browser node where the HTML is to be appended.
2. This method does the below tasks.
   1. Creates a dom node from the react element using its `type`.
   2. Add attributes to this dom node using the `props` except the `children`.
   3. Add this dom to the container. Repeact these step for all the children elements also with the container as the dom node created from element.
