import React from "react";

const ThemeContext = React.createContext("dark");

function Text({ theme }) {
  return (
    <p className={theme}>
      This is the light theme which is passed as the value to the Provider and
      consumed by the subscribing component using <b>contextType</b>
    </p>
  );
}

class ThemedPara extends React.Component {
  // Assign a contextType to read the current theme context.
  // React will find the closest theme Provider above and use its value.
  // In this example, the current theme is "dark".
  static contextType = ThemeContext;
  render() {
    return <Text theme={this.context} />;
  }
}

// Toolbar_Without_Props doesn't have to pass the theme down explicitly anymore.
function Toolbar() {
  return (
    <div>
      <ThemedPara />
    </div>
  );
}

export function ContextType() {
  return (
    <>
      <ThemeContext.Provider value="light">
        <Toolbar />
      </ThemeContext.Provider>
    </>
  );
}
