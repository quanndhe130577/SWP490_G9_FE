import React, { useState } from "react";
import { Link } from "react-router-dom";
import i18n from "i18next";
import Widgets from "../../schema/Widgets";
import { useDispatch } from 'react-redux';
import apis from "../../services/apis";
import helper from "../../services/helper";
import local from "../../services/local"
// import logo from "assets/image/bannerVn.png"

const Login = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setsubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const dispatch = useDispatch()

  const handleSubmit = async () => {
    try {
      setLoggingIn(true);
      let rs = await apis.login({
        phoneNumber, password
      });
      console.log(rs);
      if (rs && rs.statusCode === 200) {
        local.set('session', rs.data.token);
        local.set('user', JSON.stringify(rs.data));
        dispatch({
          type: 'SET_USER_INFO',
          token: rs.data.token,
          user: rs.data.user

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
    <div className="jumbotron">
      <div className=" ">
        <div className=" ">
          <div className="col-sm-12 col-md-12 " style={{ textAlign: 'center' }} >
            <img src="assets/image/bannerVn.png"
              className="image-login" />
          </div>

          <div className="con-login  border container">
            <div className="col-sm-6 col-md-6 ">
              <h2>{i18n.t("Login")}</h2>
              <div  >
                <Widgets.Text
                  required={true}
                  label={i18n.t("phoneNumber")}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
    </div>
  );
};

export default Login;
