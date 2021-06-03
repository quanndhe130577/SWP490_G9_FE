import React, { useState } from "react";
import { Link } from "react-router-dom";
import i18n from "i18next";
import Widgets from "../../schema/Widgets";
import apis from "../../services/apis";
import helper from "../../services/helper";
const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setsubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // alert(username + password);
      setLoggingIn(true);
      let rs = await apis.login({
        phonenumber: "0966848112",
        password: "12345678",
      });
      console.log(rs);
    } catch (error) {
      helper.toast("error", "Lỗi hệ thống");
      console.log(error);
    } finally {
      props.history.push("home");
      setLoggingIn(false);
    }
  };

  return (
    <div className="jumbotron ">
      <div className="container border con-login">
        <div className="col-sm-6 col-md-6 ">
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
                <button className="btn btn-primary">
                  {loggingIn ? (
                    <>
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {i18n.t("Loading")}...
                    </>
                  ) : (
                    <span>{i18n.t("Login")}</span>
                  )}
                </button>
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
