import React, { useState } from "react";
import { Link } from "react-router-dom";
import Widgets from "../../schema/Widgets";
import i18n from "i18next";

const Login = () => {
  const [user, setUser] = useState({});
  const [password, setpassword] = useState("");
  const [submitted, setsubmitted] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleChange = () => {};
  const handleSubmit = () => {};
  return (
    <div className="jumbotron">
      <div className="container  d-flex justify-content-center">
        <div className="col-sm-6 col-md-6  ">
          <div className="">
            <h2>Register</h2>
            <form name="form" onSubmit={handleSubmit}>
              <Widgets.Text
                label={i18n.t("First Name")}
                value={user.firstName}
                onChange={(e) => handleChange(e.target.value, "firstName")}
                submitted={submitted}
              />
              <Widgets.Text
                label={i18n.t("Last Name")}
                value={user.lastName}
                onChange={(e) => handleChange(e.target.value, "lastName")}
                submitted={submitted}
              />

              <Widgets.Text
                required={true}
                label={i18n.t("Username")}
                value={user.username}
                onChange={(e) => handleChange(e.target.value, "username")}
                submitted={submitted}
              />

              <Widgets.Text
                type="password"
                required={true}
                label={i18n.t("Password")}
                value={user.password}
                onChange={(e) => handleChange(e.target.value, "password")}
                submitted={submitted}
              />

              <div className="form-group">
                <button className="btn btn-primary">Register</button>
                {registering && (
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                )}
                <Link to="/login" className="btn btn-link">
                  Cancel
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
