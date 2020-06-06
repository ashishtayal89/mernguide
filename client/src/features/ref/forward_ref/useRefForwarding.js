import React, { useRef, useEffect } from "react";

export const UseRefForwarding = () => {
  const textInput = useRef(null);
  const focusTextInput = () => textInput.current.focus();
  return (
    <div>
      <Input type="text" ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={focusTextInput}
      />
    </div>
  );
};

const Input = React.forwardRef((_props, ref) => (
  <input type="text" ref={ref} />
));
