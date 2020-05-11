import React, { useEffect } from "react";

export default function UseEffect() {
  useEffect(() => {
    const intId = setInterval(() => console.log("effect"), 2000);
    return () => {
      clearInterval(intId);
    };
  });
  return (
    <div>
      {" "}
      Check the console and see the continuos loggin of effect which stop once
      we navigate to some other component
    </div>
  );
}
