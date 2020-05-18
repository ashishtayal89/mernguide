import React from "react";

const ThemeContext = React.createContext("dark");

function Text({ theme }) {
  return (
    <p className={theme}>
      Here the default value passed to createContext is being used as the value
      for the consumer component
    </p>
  );
}

// Since there is no matching provider above this component in the tree it will take the default value of context ie dark.
class ThemedPara extends React.Component {
  static contextType = ThemeContext;
  render() {
    return <Text theme={this.context} />;
  }
}

function Toolbar() {
  return (
    <div>
      <ThemedPara />
    </div>
  );
}

export function DefaultValue() {
  return <Toolbar />;
}
