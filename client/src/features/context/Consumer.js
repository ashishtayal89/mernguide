import React from "react";

const ThemeContext = React.createContext("light");

function Text({ theme }) {
  return (
    <p className={theme}>This is a dummy text to show different themes.</p>
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

export function Consumer() {
  return (
    <>
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    </>
  );
}
