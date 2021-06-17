import React, { useState } from "react";
import { Link } from "react-router-dom";
import i18n from "i18next";
import Widgets from "../../schema/Widgets";
import { useDispatch } from "react-redux";
import apis from "../../services/apis";
import helper from "../../services/helper";
import session from "../../services/session";
import { Form, Input, Button, Checkbox } from 'antd';
const Login = (props) => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const handleSubmit = async ({ phoneNumber, password }) => {
    try {
      //e.preventDefault();

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
        helper.toast("success", i18n.t("loginSuccess"));
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
  const validateNum = (e) => {
    return /^[0-9\+]{10,12}$/.test(e);
  }

  const handleOnBlur = () => {
    console.log("blur")
  }

  const onSubmit = (values) => {
    console.log(values)
  }
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

          <div className="con-login custom-login-form   border container">
            <h2 style={{ textAlign: "center" }}> {i18n.t("Login")}</h2>
            <div className="form-login col-md-6">
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item
                  label={i18n.t("phoneNumber")}
                  name="phoneNumber"
                  rules={[{ required: true },
                  () => ({
                    validator(rule, value) {
                      if (!value || value.length <= 0) {
                        return Promise.reject(
                          new Error(
                            "Bat buoc nhap"
                          )
                        );
                      }
                      const checkPhone = /^[0-9\+]{10,12}$/.test(value);
                      if (checkPhone === false) {
                        return Promise.reject(
                          new Error(
                            "khong dung dinh dang"
                          )
                        );
                      }
                      return Promise.resolve();
                    }
                  })
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={i18n.t("Password")}
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item>
                  <div className="ml-3 form-group d-flex justify-content-center">
                    <button className="btn btn-info"> {i18n.t("Login")}</button>
                    <label style={{ marginLeft: "20px", marginTop: "auto" }}>{i18n.t("or")}</label>
                    <Link to="/register" className="btn btn-link">
                      {i18n.t("Register")}
                    </Link>
                  </div>

                </Form.Item>
              </Form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
