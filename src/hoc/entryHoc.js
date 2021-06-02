import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
const entryHoc = (Component) => {
  return (
    <div className="jumbotron ">
      <div className="container border con-login">
        <div className="col-sm-6 col-md-6 ">
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />

            <Route
              exact
              path="/register"
              name="Register Page"
              component={Register}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default entryHoc;
