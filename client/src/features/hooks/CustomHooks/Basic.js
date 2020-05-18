import React, { useState } from "react";

function usePrecision(deci) {
  const [value, setNumber] = useState();
  const [decimal] = useState(deci);

  return value && !Number.isNaN(value)
    ? [
        {
          rounded: Number.parseFloat(value).toPrecision(decimal),
          number: value
        },
        setNumber
      ]
    : [{}, setNumber];
}

function PrecisionTwo() {
  const [numbers, setNumber] = usePrecision(2);
  return (
    <>
      <input
        type="number"
        onChange={e => setNumber(e.target.value)}
        value={numbers.number}
      ></input>
      <label>Rounded To 2 precision : </label> {numbers.rounded}
    </>
  );
}

function PrecisionThree() {
  const [numbers, setNumber] = usePrecision(3);
  return (
    <>
      <input
        type="number"
        onChange={e => setNumber(e.target.value)}
        value={numbers.number}
      ></input>
      <label>Rounded To 3 precision : </label> {numbers.rounded}
    </>
  );
}

export function Basic() {
  return (
    <>
      <PrecisionThree />
      <PrecisionTwo />
    </>
  );
}
