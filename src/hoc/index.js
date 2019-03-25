import React, { Component } from "react";
import Cookie from "../utils/cookie";
import { Redirect } from "dva/router";

function hoc(Comp) {
  return class extends Component {
    render() {
      if (Cookie.get("token")) {
        return <Comp {...this.props} />;
      } else {
        return <Redirect to="/" />;
      }
    }
  };
}
export default hoc;
