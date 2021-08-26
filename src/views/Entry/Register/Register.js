import React, { useState, useEffect } from "react";
import { Button } from "antd";
import i18n from "i18next";
import apis from "../../../services/apis";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import helper from "../../../services/helper";

const Login = (props) => {
  const [user, setUser] = useState({
    // code: "123456",
    // OTPID: 3,
    // DOB: "1999-10-21",
    // Avatar: null,
    // roleNormalizedName: "TRADER",
  });
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  // const [registering, setRegistering] = useState(false);
  const [roles, setRoles] = useState([]);

  const handleChange = (value, pro) => {
    if (submitted) setSubmitted(false);
    setUser((prevState) => ({
      ...prevState,
      [pro]: value,
    }));
  };

  const getOTP = async (type = "") => {
    try {
      let rs = await apis.getOtp({}, "GET", user.phoneNumber);
      if (rs && rs.statusCode === 200)
        if (type === "reset") {
          helper.toast("success", i18n.t(rs.message || "systemError"));

        }
      return rs
    } catch (error) {
      console.log(error)
    }
  }
  const handleSubmit = async () => {
    let rs;
    try {
      setSubmitted(true);
      if (!user.phoneNumber) {
        setSubmitted(false);
        return helper.toast("error", i18n.t("Vui lòng điền số điện thoại"));

      } else if (step === 0) {
        rs = await getOTP()
        if (rs && rs.statusCode === 200) {
          setStep(1);
          setSubmitted(false);
          handleChange(rs.data.otpid, "otpid");
          helper.toast("success", i18n.t(rs.message || "systemError"));
        }
        //setStep(1);
      } else if (step === 1) {
        setSubmitted(false);
        rs = await apis.checkOtp(
          { otpid: user.otpid, code: user.code, phoneNumber: user.phoneNumber },
          "POST"
        );
        if (rs && rs.statusCode === 200 && rs.success) {
          setStep(2);
          helper.toast("success", i18n.t(rs.message || "systemError"));
        }
        //setStep(2);
      } else if (step === 2) {
        rs = await apis.register(user);
        if (rs && rs.statusCode === 200) {
          helper.toast("success", i18n.t(rs.message || "systemError"));
          props.history.push("login");
        }
      }
    } catch (error) {
      helper.toast("error", i18n.t(rs.message || "systemError"));
    }
  };

  const fetchAllRole = async () => {
    try {
      // get all role
      let rs = await apis.getAllRole({}, "GET");
      if (rs && rs.statusCode === 200 && rs.data) {
        // delete admin role
        let noAdmin = rs.data.filter((el) => el.normalizedName !== "ADMIN");
        noAdmin.forEach((el) => {
          helper.renameKey(el, "displayName", "label");
          helper.renameKey(el, "normalizedName", "value");
        });
        setRoles(noAdmin);
      }
    } catch (error) {
      helper.toast("error", i18n.t("systemError"));
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllRole();
  }, []);
  const textHeaders = () => {
    let msg = "registerAccount";
    if (step === 1) {
      msg = "Vui Lòng Nhập Mã Xác Minh";
    } else if (step === 2) {
      msg = "Hoàn tất thông tin";
    }
    return i18n.t(msg);
  };
  const _handleKeyDown = (e) => {
    // console.log(e.key);
    if (e.key === "Enter") {
      handleSubmit();
    }
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
              <h2 style={{ textAlign: "center" }}> {textHeaders()}</h2>
              <div name="form">
                {step === 0 && (
                  <Step0
                    value={user.phoneNumber}
                    onChange={(e) => handleChange(e, "phoneNumber")}
                    onKeyDown={_handleKeyDown}
                  />
                )}
                {step === 1 && (
                  <Step1
                    phoneNumber={user.phoneNumber}
                    onChange={(e) => handleChange(e, "code")}
                    getOTP={getOTP}
                    submitted={submitted}

                  />
                )}

                {step === 2 && (
                  <>
                    <Step2
                      user={user}
                      handleChange={(value, prop) => handleChange(value, prop)}
                      submitted={submitted}
                      items={roles}
                    />
                  </>
                )}

                <div className="form-group d-flex justify-content-center">
                  {step === 1 && (
                    <Button
                      className="mr-2 btn"
                      type="primary"
                      onClick={() => setStep(0)}
                    >
                      {i18n.t("previous")}
                    </Button>
                  )}
                  <Button
                    className="btn mr-2"
                    type="danger"
                    onClick={() => props.history.push("/login")}

                  >
                    {i18n.t("cancel")}
                  </Button>
                  <Button
                    className="mr-2 btn"
                    type="primary"
                    onClick={handleSubmit}
                    disabled={submitted}
                    loading={submitted}
                  >
                    {step === 0 || step === 1
                      ? i18n.t("next")
                      : i18n.t("Register")}
                  </Button>




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
