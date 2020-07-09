import React, { useState } from "./libs/react";

const Counter = () => {
  const [count, setCount] = useState(1);
  return (
    <div>
      <div className="counter" onclick={() => setCount(c => c + 1)}>
        Count: {count}
      </div>
      <div>Click on counter too increment </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="header">
      <h1 title="child">App </h1>
    </div>
  );
};

const Main = () => (
  <div className="main">
    <Counter />
  </div>
);
const App = () => (
  <div>
    <Header />
    <Main />
  </div>
);

export default App;
