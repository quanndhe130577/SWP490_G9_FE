import React, { Component } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import "./css/custom.css";
import "antd/dist/antd.css";
// Containers
import { DefaultLayout } from "./Containers";
// Pages
import Login from "./Views/Entry/Login";
import Register from "./Views/Entry/Register";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          {/* <Route exact path="/" name="Login Page" component={Login} /> */}

          <Route
            exact
            path="/register"
            name="Register Page"
            component={Register}
          />
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
