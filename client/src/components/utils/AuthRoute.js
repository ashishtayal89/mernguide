import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

class AuthRoute extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { auth, ...rest } = this.props;
    if (auth.isFetching) {
      return "LOADING...";
    }
    return auth.data ? <Route {...rest}></Route> : <Redirect to="/" />;
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(AuthRoute);
