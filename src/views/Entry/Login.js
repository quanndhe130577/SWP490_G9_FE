import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import i18n from "i18next";
import Widgets from "../../schema/Widgets";
import { useDispatch } from "react-redux";
import apis from "../../services/apis";
import helper from "../../services/helper";
import session from "../../services/session";

const Login = (props) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("0312345678");
  const [password, setPassword] = useState("12345678");
  const [submitted, setSubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setLoggingIn(true);
      setSubmitted(true);
      let rs = await apis.login({
        phoneNumber,
        password,
      });
      if (rs && rs.statusCode === 200) {
        session.set("session", rs.data.token);
        session.set("user", JSON.stringify(rs.data.user));
        dispatch({
          type: "SET_USER_INFO",
          token: rs.data.token,
          user: rs.data.user,
        });
        helper.toast("success", i18n.t("loginSuccess" || "systemError"));
        props.history.push("home");
      }
    } catch (error) {
      helper.toast("error", i18n.t("systemError"));
      console.log(error);
    } finally {
      setLoggingIn(false);
    }
  };
  const updateSubmitted = () => {
    if (submitted) setSubmitted(true);
  };
  useEffect(() => {
    session.set("session", null);
    session.set("user", null);
  }, []);
  return (
    <div className="jumbotron">
      <div className="div-login">
        <div>
          <div className="col-sm-12 col-md-12 " style={{ textAlign: "center" }}>
            <img
              src="assets/image/bannerVn.png"
              alt="banner"
              className="image-login"
            />
          </div>

          <div className="con-login  border container">
            <form className="col-sm-4 col-md-4 " onSubmit={handleSubmit}>
              <h2 style={{ textAlign: "center" }}> {i18n.t("Login")}</h2>
              <div>
                <Widgets.Phone
                  required={true}
                  label={i18n.t("phoneNumber")}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e);
                    updateSubmitted();
                  }}
                  submitted={submitted}
                />

                <Widgets.Text
                  type="password"
                  required={true}
                  label={i18n.t("Password")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e);
                    updateSubmitted();
                  }}
                  submitted={submitted}
                />
                <div>
                  <Link
                    to="/forgetPassword"
                    style={{ color: "black" }}
                    className=""
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <div className="form-group d-flex justify-content-center">
                  <button className="btn btn-info p-1">
                    {loggingIn ? (
                      <>
                        {i18n.t("Login")}
                        <span className="spinner-border spinner-border-sm ml-1" />
                      </>
                    ) : (
                      <span>{i18n.t("Login")}</span>
                    )}
                  </button>
                  {/* <button
                    onClick={(e) => {
                      setPhoneNumber("0357708915");
                      // handleSubmit(e);
                    }}
                  >
                    trader
                  </button> */}
                  <div className="ml-3 d-flex align-items-base">
                    <label className="pb-0">{i18n.t("or")}</label>
                    <Link to="/register" className="btn btn-link p-1">
                      {i18n.t("Register")}
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
