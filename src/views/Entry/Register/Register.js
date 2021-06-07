import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../services/apis";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import helper from "../../../services/helper";

const Login = () => {
  const [user, setUser] = useState({
    OTP: "123456",
    OTPID: 3,
    DOB: "1999-10-21",
    Avatar: null,
  });
  const [step, setStep] = useState(0);
  const [submitted, setsubmitted] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [roles, setRoles] = useState([]);

  const handleChange = (value, pro) => {
    setUser((prevState) => ({
      ...prevState,
      [pro]: value,
    }));
  };
  const handleSubmit = async () => {
    try {
      if (step === 0 && user.phoneNumber) {
        // let param = "/" + user.phoneNumber;
        // let rs = await apis.getOtp({}, "GET", param);
        // if (rs && rs.statusCode === 200) {
        //   helper.toast("success", i18n.t(rs.message || "systemError"));
        // }
        setStep(1);
      } else if (step === 1) {
        setStep(2);
      } else {
        let rs = await apis.register(user);
        if (rs && rs.statusCode === 200) {
          helper.toast("success", i18n.t(rs.message || "systemError"));
        }
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", i18n.t("systemError"));
    }
  };

  useEffect(async () => {
    // get all role
    let rs = await apis.getAllRole({}, "GET");
    if (rs && rs.statusCode === 200 && rs.data) {
      // delete admin role
      let noAdmin = rs.data.filter((el) => el.normalizedName !== "ADMIN");
      noAdmin.map((el) => {
        helper.renameKey(el, "displayName", "label");
        helper.renameKey(el, "normalizedName", "value");
      });
      setRoles(noAdmin);
    }
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
  return (
    <div className="jumbotron ">
      <div className="container border con-login">
        <div className="col-sm-6 col-md-6 ">
          <div className="">
            <h2>{textHeaders()}</h2>
            <div name="form">
              {step === 0 && (
                <Step0
                  value={user.phoneNumber}
                  onChange={(e) => handleChange(e.target.value, "phoneNumber")}
                />
              )}
              {step === 1 && (
                <Step1
                  phoneNumber={user.phoneNumber}
                  // value={user.OTP}
                  // onChange={(e) => handleChange(e.target.value, "phoneNumber")}
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
                  {/* <Widgets.Text
                    label={i18n.t("First Name")}
                    value={user.firstName}
                    onChange={(e) => handleChange(e.target.value, "firstName")}
                    submitted={submitted}
                  />
                  <Widgets.Text
                    label={i18n.t("Last Name")}
                    value={user.lastName}
                    onChange={(e) => handleChange(e.target.value, "lastName")}
                    submitted={submitted}
                  />
                  <Widgets.Text
                    label={i18n.t("identifyCode")}
                    value={user.identifyCode}
                    onChange={(e) =>
                      handleChange(e.target.value, "identifyCode")
                    }
                    submitted={submitted}
                  />
                  <Widgets.Select
                    label={i18n.t("role")}
                    value={user.roleNormalizedName}
                    onChange={(e) => handleChange(e, "RoleNormalizedName")}
                    submitted={submitted}
                    items={roles}
                  />

                  <Widgets.Text
                    type="password"
                    required={true}
                    label={i18n.t("Password")}
                    value={user.password}
                    onChange={(e) => handleChange(e.target.value, "password")}
                    submitted={submitted}
                  /> */}
                </>
              )}

              <div className="form-group">
                {step === 1 && (
                  <button
                    className="btn btn-info mr-1"
                    onClick={() => setStep(0)}
                  >
                    {i18n.t("previous")}
                  </button>
                )}

                <button className="btn btn-info block" onClick={handleSubmit}>
                  {step === 0 || step === 1
                    ? i18n.t("next")
                    : i18n.t("Register")}
                </button>

                <Link to="/login" className="btn btn-link">
                  {i18n.t("cancel")}
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
