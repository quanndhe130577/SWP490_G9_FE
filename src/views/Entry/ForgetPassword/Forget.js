import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
import { apis, helper } from "../../../services";
import { useHistory } from "react-router-dom";

export default function Forgot() {
  const history = useHistory();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setPhone(e);
  };

  const sendOTPtoPhone = async () => {
    let rs;
    try {
      setLoading(true)
      if (!phone) {
        return helper.toast("error", "Vui lòng điền số điện thoại")
      }
      rs = await apis.getResetPassword({}, "GET", phone);
      if (rs && rs.statusCode === 200) {
        history.push({
          pathname: "/checkOTP",
          state: {
            resetToken: rs.data.resetToken,
            phone,
            otpid: rs.data.otpid,
          },
        });
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  };

  const onPrev = () => {
    history.push("/login");
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
              <h2 style={{ textAlign: "center" }}>Quên mật khẩu</h2>
              <div name="form">
                <Row>
                  <Col md="12">
                    <Widgets.Phone
                      required={true}
                      value={phone}
                      label={i18n.t("phoneNumber")}
                      onChange={onChange}
                    />
                  </Col>
                </Row>
                <div style={{ display: "flex", justifyContent: "center" }}>

                  <button className="btn btn-danger block mr-2" onClick={onPrev}
                    disabled={loading}
                  >
                    {i18n.t("previous")}
                  </button>
                  <button
                    className="btn btn-info block mr-2"
                    onClick={sendOTPtoPhone}
                    disabled={loading}
                  >
                    {i18n.t(!loading ? "SendOTP" : "...")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
