import React, { useRef } from "react";

export const UseRef = () => {
  const textInput = useRef(null);
  const focusTextInput = () => textInput.current.focus();
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
