import React, { Component } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Header from "./components/Header";
import * as actions from "./actions";
import "./App.css";
import Routes from "./components/Routes";

class App extends Component {
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <Header />
          <div className="main">
            <Switch>
              <Routes />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
