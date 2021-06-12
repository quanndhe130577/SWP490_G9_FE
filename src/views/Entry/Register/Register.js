import React, { useState, useEffect } from "react";
import i18n from "i18next";
import apis from "../../../services/apis";
import Step0 from "./Step0";
import Step1 from "./Step1";
import Step2 from "./Step2";
import helper from "../../../services/helper";

const Login = (props) => {
  const [user, setUser] = useState({
    OTP: "123456",
    OTPID: 3,
    DOB: "1999-10-21",
    Avatar: null,
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
  const handleSubmit = async () => {
    try {
      setSubmitted(true);
      if (!user.phoneNumber) {
        return helper.toast("error", i18n.t("Vui lòng điền số điện thoại"));
      } else if (step === 0) {
        // let param = "/" + user.phoneNumber;
        // let rs = await apis.getOtp({}, "GET", param);
        // if (rs && rs.statusCode === 200) {
        //   helper.toast("success", i18n.t(rs.message || "systemError"));
        // }
        setStep(1);
      } else if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        let rs = await apis.register(user);
        if (rs && rs.statusCode === 200) {
          helper.toast("success", i18n.t(rs.message || "systemError"));
          props.history.push("login");
        }
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", i18n.t("systemError"));
    }
  };

  const fetchAllRole = async () => {
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
                  />
                )}
                {step === 1 && <Step1 phoneNumber={user.phoneNumber} />}

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
                    <button
                      className="btn btn-info mr-2"
                      onClick={() => setStep(0)}
                    >
                      {i18n.t("previous")}
                    </button>
                  )}

                  <button
                    className="btn btn-info block mr-2"
                    onClick={handleSubmit}
                  >
                    {step === 0 || step === 1
                      ? i18n.t("next")
                      : i18n.t("Register")}
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => props.history.push("/login")}
                  >
                    {i18n.t("cancel")}
                  </button>

                  {/* <Link to="/login" className="btn btn-link btn-warning">
                    {i18n.t("cancel")}
                  </Link> */}
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
