import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Header from "./components/Header";
import UseState from "./features/hooks/UseState";
import * as actions from "./actions";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <Header />
          <div className="main">
            <Switch>
              <Route exact path="/hooks/useState" component={UseState} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
