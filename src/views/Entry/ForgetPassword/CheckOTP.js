import i18n from "i18next";
import React, { useState } from "react";
import { Button } from "antd";
import { useLocation, useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import { apis, helper } from "../../../services";

export default function CheckOTP() {
  const history = useHistory();

  const [OTP, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const onChangeOTP = (e) => {
    setOTP(e);
  };

  const onChangePassword = (e) => {
    setPassword(e);
  };

  const onChangeNewPassword = (e) => {
    setNewPassword(e);
  };

  const sendOTP = async () => {
    let rs;
    setLoading(true);
    try {
      rs = await apis.resetPassword(
        {
          ResetToken: location.state.resetToken,
          Code: OTP,
          phoneNumber: location.state.phone,
          NewPassword: password,
          ConfirmPassword: newPassword,
          OTPID: location.state.otpid,
        },
        "POST"
      );
      if (rs && rs.statusCode === 200) {
        helper.toast("success", i18n.t(rs.message || "systemError"));
        history.push("/login");
      }
    } catch (error) {
      helper.toast("error", i18n.t(rs.Message || "systemError"));
    } finally {
      setLoading(false);
    }
  };

  const onPrev = () => {
    history.push("/forgetPassword");
  };
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
                    <Widgets.Text
                      required={true}
                      label={i18n.t("OTP")}
                      value={OTP}
                      onChange={onChangeOTP}
                    />
                  </Col>
                  <Col md="12">
                    <Widgets.Text
                      required={true}
                      type="password"
                      label={i18n.t("NewPassword")}
                      value={password}
                      onChange={onChangePassword}
                    />
                  </Col>
                  <Col md="12">
                    <Widgets.Text
                      required={true}
                      type="password"
                      label={i18n.t("Re-NewPassword")}
                      value={newPassword}
                      onChange={onChangeNewPassword}
                    />
                  </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    className="btn block mr-2"
                    type="danger"
                    onClick={onPrev}
                    loading={loading}
                  >
                    {i18n.t("previous")}
                  </Button>
                  <Button
                    type="primary"
                    className="btn block mr-2"
                    onClick={sendOTP}
                    loading={loading}
                  >
                    {i18n.t("Confirm")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
