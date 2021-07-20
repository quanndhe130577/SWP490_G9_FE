import React, { Component, useState } from "react";
import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
import { Link } from "react-router-dom";
import { apis, helper } from "../../../services";
import { useHistory } from "react-router-dom";

export default function Forgot() {

  const history = useHistory();
  const [phone, setPhone] = useState('');

  const onChange = (e) => {
    setPhone(e);
  }


  const sendOTPtoPhone = async () => {
    let rs;
    try {
      rs = await apis.getResetPassword({}, "GET", phone);
      if (rs && rs.statusCode === 200) {
        history.push({
          pathname: '/checkOTP',
          state: {
            resetToken: rs.data.resetToken,
            phone,
            otpid: rs.data.otpid
          },
        });
      }
    } catch (error) {
      // helper.toast("error", i18n.t(rs.Message || "systemError"));
    }
  }

  const onPrev = () => {
    history.push("/login")
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

          <div className="con-login  border container"

          >

            <div className="col-sm-6 col-md-6 ">
              <h2 style={{ textAlign: "center" }}> Quên mật khẩu</h2>
              <div name="form">

                <Row>
                  {/* <Col md="2"></Col>
        <Col md="8" style={{ textAlign: "center" }} className="mb-4">
          <img src="assets/image/bannerVn.png" className="image" />
        </Col> */}
                  <Col md="12">
                    <Widgets.Phone
                      required={true}
                      value={phone}
                      label={i18n.t("phoneNumber")}
                      onChange={onChange}
                    // onKeyDown={onKeyDown}
                    //  submitted={submitted}
                    />
                  </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: 'center' }} >
                  <button
                    className="btn btn-info block mr-2"
                    onClick={sendOTPtoPhone}
                  > {i18n.t("SendOTP")}
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
