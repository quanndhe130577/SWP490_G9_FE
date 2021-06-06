import React, { useState } from "react";
import { Link } from "react-router-dom";
import i18n from "i18next";
import Widgets from "../../schema/Widgets";
import { useDispatch } from 'react-redux';
import apis from "../../services/apis";
import helper from "../../services/helper";
import local from "../../services/local"
const Login = (props) => {
  const [phonenumber, setphonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setsubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    try {
      // e.preventDefault();
      setLoggingIn(true);
      let rs = await apis.login({
        phonenumber, password
      });
      console.log(rs);
      if (rs && rs.statusCode === 200) {
        local.set('session', rs.data.token);
        local.set('userInfo', JSON.stringify(rs.data.userInfo));
        dispatch({
          type: 'SET_USER_INFO',
          token: rs.data.token,
          userInfo: rs.data.userInfo

        })

        // props.dispatch()
        helper.toast("success", i18n.t('loginSuccess'));
        props.history.push("home");
      }
    } catch (error) {
      helper.toast("error", i18n.t('systemError'));
      console.log(error);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="jumbotron ">
      <div className="container border con-login">
        <div className="col-sm-6 col-md-6 ">
          <div className="">
            <h2>{i18n.t("Login")}</h2>
            <div  >
              <Widgets.Text
                required={true}
                label={i18n.t("phonenumber")}
                value={phonenumber}
                onChange={(e) => setphonenumber(e.target.value)}
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
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {loggingIn ? (
                    <>
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {i18n.t("loading")}...
                    </>
                  ) : (
                    <span>{i18n.t("Login")}</span>
                  )}
                </button>
                <Link to="/register" className="btn btn-link">
                  {i18n.t("Register")}
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
