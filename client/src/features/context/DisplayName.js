import React from "react";
import { Provider } from "react-redux";
import { Consumer } from "./DisplayName";

const ThemeContext = React.createContext("light");
ThemeContext.displayName = "ChangedContextName";

function Text({ theme }) {
  return (
    <p className={theme}>
      Go to react dev tools and see that the name of the provider is
      "ChangedContextName.Provider" and that of consumer is
      "ChangedContextName.Consumer"
    </p>
  );
}

function ThemedPara() {
  return (
    <ThemeContext.Consumer>
      {theme => <Text theme={theme} />}
    </ThemeContext.Consumer>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedPara />
    </div>
  );
}

export function DisplayName() {
  return (
    <>
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    </>
  );
}
