import React, { useCallback, useMemo, useState } from "react";

export function UseMemo() {
  const [count, setCount] = useState(0);
  const countSquare = useMemo(() => count * count, [count]);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>{" "}
      {`${count} * ${count}`} : {countSquare}
    </div>
  );
}

function ShowCount({ count, incrementCount }) {
  return (
    <div>
      <button onClick={() => incrementCount(count + 1)}>Add 1</button> : {count}
    </div>
  );
}

export function UseCallback() {
  const [count, setCount] = useState(0);
  const incrementCount = useCallback(count => {
    setCount(count);
  }, []);
  return <ShowCount count={count} incrementCount={incrementCount} />;
}
