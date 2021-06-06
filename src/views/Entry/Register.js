import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Widgets from "../../schema/Widgets";
import i18n from "i18next";
import apis from "../../services/apis";
import helper from "../../services/helper";

const Login = () => {
  const [user, setUser] = useState({ OTP: "123456", OTPID: 1, DOB: "1999-10-21", Avatar: null, });
  const [password, setpassword] = useState("");
  const [submitted, setsubmitted] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [roles, setRoles] = useState([]);

  const handleChange = (value, pro) => {
    setUser(prevState => ({
      ...prevState,
      [pro]: value
    }))
  };
  const handleSubmit = async (e) => {
    try {

      let rs = await apis.register(user)
      if (rs && rs.statusCode === 200) {
        helper.toast("success", i18n.t(rs.message || 'systemError'));

      }

    } catch (error) {
      console.log(error);
      helper.toast("error", i18n.t(rs.message || 'systemError'));
    }
  };

  useEffect(async () => {
    // get all role 
    let rs = await apis.getAllRole({}, "GET");
    if (rs && rs.statusCode === 200 && rs.data) {
      // delete admin role
      let noAdmin = rs.data.filter(el => el.normalizedName !== "ADMIN");
      noAdmin.map(el => {
        helper.renameKey(el, "displayName", "label")
        helper.renameKey(el, "normalizedName", "value")
      })
      setRoles(noAdmin)
    }
  }, [])
  return (
    <div className="jumbotron ">
      <div className="container border con-login">
        <div className="col-sm-6 col-md-6 ">
          <div className="">
            <h2>Register</h2>
            <div name="form" >
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
                label={i18n.t("identifyCode")}
                value={user.identifyCode}
                onChange={(e) => handleChange(e.target.value, "identifyCode")}
                submitted={submitted}
              />
              <Widgets.Select
                label={i18n.t("role")}
                value={user.roleNormalizedName}
                onChange={(e) => handleChange(e, "RoleNormalizedName")}
                submitted={submitted}
                items={roles}
              />

              <Widgets.Text
                required={true}
                label={i18n.t("phoneNumber")}
                value={user.phoneNumber}
                onChange={(e) => handleChange(e.target.value, "phoneNumber")}
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
                <button className="btn btn-primary"
                  onClick={handleSubmit}
                >Register</button>
                {registering && (
                  <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                )}
                <Link to="/login" className="btn btn-link">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
