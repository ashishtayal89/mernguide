import React, { useState, memo } from "react";

let themes = ["light", "dark"];

const ThemeContext = React.createContext("light");

function Text({ theme }) {
  console.log("ReRender Text");
  return (
    <p className={theme}>
      All child components get rendered on change of value props of
      Context.Provider
    </p>
  );
}

function ThemedPara() {
  console.log("ReRender ThemedPara");
  return (
    <ThemeContext.Consumer>
      {theme => <Text theme={theme} />}
    </ThemeContext.Consumer>
  );
}

const Toolbar = memo(function() {
  console.log("ReRender Toolbar");
  return (
    <div>
      <ThemedPara />
    </div>
  );
});

export function ReRender() {
  const [theme, changeTheme] = useState("light");
  return (
    <>
      {themes.map(theme => (
        <button
          onClick={() => {
            changeTheme(theme);
          }}
        >
          {theme.toUpperCase()}
        </button>
      ))}
      <ThemeContext.Provider value={theme}>
        <Toolbar />
      </ThemeContext.Provider>
    </>
  );
}
