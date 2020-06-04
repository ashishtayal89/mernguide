import React, { useRef, useEffect } from "react";

export const UseRef = () => {
  const textInput = useRef(null);
  const focusTextInput = () => textInput.current.focus();
  useEffect(() => {
    focusTextInput();
  }, []);
  return (
    <div>
      <input type="text" ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={focusTextInput}
      />
    </div>
  );
};
