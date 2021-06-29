import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ConfigProvider } from "antd";
import "moment/locale/vi";
import locale from "antd/lib/locale/vi_VN";
import "./css/custom.css";
import "antd/dist/antd.css";
import "./css/bootstrap.css";
// Containers
import { DefaultLayout } from "./containers";
// Pages
import Login from "./views/Entry/Login";
import Register from "./views/Entry/Register/Register";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <ConfigProvider locale={locale}>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route
              exact
              path="/register"
              name="Register Page"
              component={Register}
            />
            <Route path="/" name="Home" component={DefaultLayout} />
          </Switch>
        </ConfigProvider>
      </BrowserRouter>
    );
  }
}

export default App;
