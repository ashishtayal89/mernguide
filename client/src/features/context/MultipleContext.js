import React from "react";

const ThemeContext = React.createContext("light");
const UserContext = React.createContext({ name: "Ashish" });

function Text({ theme, name }) {
  return <p className={theme}>{`Hi this is ${name}`}</p>;
}

function ThemedPara() {
  return (
    <UserContext.Consumer>
      {({ name }) => (
        <ThemeContext.Consumer>
          {theme => <Text theme={theme} name={name} />}
        </ThemeContext.Consumer>
      )}
    </UserContext.Consumer>
  );
}

function Toolbar() {
  return (
    <div>
      <ThemedPara />
    </div>
  );
}

export function MultipleContext() {
  return (
    <>
      <UserContext.Provider value={{ name: "Mohan" }}>
        <ThemeContext.Provider value="dark">
          <Toolbar />
        </ThemeContext.Provider>
      </UserContext.Provider>
    </>
  );
}
