import React, { useContext } from "react";

const ThemeContext = React.createContext("light");

function Text({ theme }) {
  return (
    <p className={theme}>This is a dummy text to show different themes.</p>
  );
}

function ThemedPara() {
  const theme = useContext(ThemeContext);
  return <Text theme={theme} />;
}

function Toolbar() {
  return (
    <div>
      <ThemedPara />
    </div>
  );
}

export function UseContext() {
  return (
    <>
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    </>
  );
}
