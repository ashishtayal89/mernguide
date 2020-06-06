import React from "react";

export class CallbackRefForwarding extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      if (this.textInput) this.textInput.focus();
    };
  }

  render() {
    return (
      <div>
        <Input forwardedRef={this.setTextInputRef} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}

const Input = ({ forwardedRef }) => <input type="text" ref={forwardedRef} />;
