import React, { useState } from "react";

const themes = ["light", "dark"];

function Text({ theme }) {
  return (
    <p className={theme}>
      Here the theme is being passed as props through multiple components in the
      heirarchy
    </p>
  );
}

function ThemedPara({ theme }) {
  return <Text theme={theme} />;
}

function Toolbar({ theme }) {
  return (
    <div>
      <ThemedPara theme={theme} />
    </div>
  );
}

export function WithoutContext() {
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
      <Toolbar theme={theme} />
    </>
  );
}
