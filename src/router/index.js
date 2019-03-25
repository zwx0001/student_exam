import React from "react";
import { Router, Switch, Route } from "dva/router";
import Login from "../pages/login";
import Test from '../pages/test';
function Routerview({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/test" component={Test} />
      </Switch>
    </Router>
  );
}
export default Routerview;
