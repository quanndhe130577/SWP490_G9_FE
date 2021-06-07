import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import "./css/custom.css";
import "antd/dist/antd.css";
// Containers
import { DefaultLayout } from "./containers";
// Pages
import Login from "./views/Entry/Login";
import Register from "./views/Entry/Register";
import ChangeUserInfo from "./views/Entry/ChangeUserInfo/ChangeUserInfo";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route
            exact
            path="/register"
            name="Register Page"
            component={Register}
          />
          <Route
            path="/changeUserInfo/:action"
            name="ChangeUserInfo"
            component={ChangeUserInfo}
          />
          <Route path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
