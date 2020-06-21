// const element = <h1 title="foo">Hello</h1>

// const element = React.createElement(
//   "h1",
//   { title: "foo" },
//   "Hello"
// )

const renderApp = () => {
  const element = {
    type: "h2",
    props: {
      title: "Revision",
      children: "Chapter 1 (Revision)"
    }
  };
  const container = document.getElementById("chapter1");
  const node = document.createElement(element.type);
  node["title"] = element.props.title;
  const text = document.createTextNode("");
  text["nodeValue"] = element.props.children;
  node.appendChild(text);
  container.appendChild(node);
};
export default { renderApp };
