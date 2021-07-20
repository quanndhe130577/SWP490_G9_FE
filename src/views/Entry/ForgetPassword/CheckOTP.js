import i18n from "i18next";
import React, { Component, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Col, Row } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import { apis, helper } from "../../../services";
import { useHistory } from "react-router-dom";

export default function CheckOTP() {

  const history = useHistory();

  const [OTP, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [phone, setPhone] = useState('');

  const location = useLocation();

  const onChangeOTP = (e) => {
    setOTP(e);
  }

  const onChangePassword = (e) => {
    setPassword(e);
  }

  const onChangeNewPassword = (e) => {
    setNewPassword(e);
  }

  const sendOTP = async () => {
    let rs;
    try {

      rs = await apis.resetPassword({
        ResetToken: location.state.resetToken,
        Code: OTP,
        phoneNumber: location.state.phone,
        NewPassword: password,
        ConfirmPassword: newPassword,
        OTPID: location.state.otpid
      }, "POST");
      if (rs && rs.statusCode === 200) {
        helper.toast("success", i18n.t(rs.message || "systemError"));
        history.push("/login")
      }
    } catch (error) {
      helper.toast("error", i18n.t(rs.Message || "systemError"));
    }
  };

  const onPrev = () => {
    history.push("/forgetPassword")
  }
  return (

    <div className="jumbotron">
      <div className="div-login pt-0">
        <div className=" ">
          <div className="col-sm-12 col-md-12 " style={{ textAlign: "center" }}>
            <img
              src="assets/image/bannerVn.png"
              alt="banner"
              className="image-login"
            />
          </div>

          <div className="con-login  border container">

            <div className="col-sm-6 col-md-6 ">
              <h2 style={{ textAlign: "center" }}> {i18n.t("EnterOTP")}</h2>
              <div name="form">

                <Row>

                  <Col md="12">
                    <Widgets.OTP
                      required={true}
                      label={i18n.t("OTP")}
                      value={OTP}
                      onChange={onChangeOTP}
                    // onKeyDown={onKeyDown}
                    // submitted={submitted}
                    />
                  </Col>
                  <Col md="12">
                    <Widgets.Text
                      required={true}
                      type="password"
                      label={i18n.t("NewPassword")}
                      value={password}
                      onChange={onChangePassword}
                    // onKeyDown={onKeyDown}
                    // submitted={submitted}
                    />
                  </Col>
                  <Col md="12">
                    <Widgets.Text
                      required={true}
                      type="password"
                      label={i18n.t("Re-NewPassword")}
                      value={newPassword}
                      onChange={onChangeNewPassword}
                    // onKeyDown={onKeyDown}
                    // submitted={submitted}
                    />
                  </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: 'center' }} >
                  <button
                    className="btn btn-info block mr-2"
                    onClick={sendOTP}
                  > {i18n.t("Confirm")}
                  </button>
                  <button
                    className="btn btn-info block mr-2"
                    onClick={onPrev}
                  > {i18n.t("previous")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >

  );
}
