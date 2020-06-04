import React from "react";

export class StringRef_Legacy extends React.Component {
  constructor(props) {
    super(props);

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.refs.textInput) this.refs.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Using string as ref
    return (
      <div>
        <input type="text" ref="textInput" />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
