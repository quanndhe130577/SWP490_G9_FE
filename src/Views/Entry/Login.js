import React, { useState } from "react";
import { Link } from "react-router-dom";
import i18n from "i18next";
import Widgets from "../../schema/Widgets";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setsubmitted] = useState(false);
  const [loggingIn, setloggingIn] = useState(false);

  const handleChange = () => {};
  const handleSubmit = () => {};
  return (
    <div className="jumbotron">
      <div className="container  d-flex justify-content-center">
        <div className="col-sm-6 col-md-6  ">
          <div className="">
            <h2>{i18n.t("Login")}</h2>
            <form name="form" onSubmit={handleSubmit}>
              <Widgets.Text
                required={true}
                label={i18n.t("Username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                submitted={submitted}
              />

              <Widgets.Text
                type="password"
                required={true}
                label={i18n.t("Password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                submitted={submitted}
              />
              <div className="form-group">
                <button className="btn btn-primary">{i18n.t("Login")}</button>
                {loggingIn && (
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                )}
                <Link to="/register" className="btn btn-link">
                  {i18n.t("Register")}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
