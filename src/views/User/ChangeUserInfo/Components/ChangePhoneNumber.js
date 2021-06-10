import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import helper from "../../../../services/helper";
import local from "../../../../services/local";
import Config from "../../../../services/config";
import Widgets from "../../../../schema/Widgets";

class ChangePhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comfirm: false,
      newPhonenumber: "",
      password: "",
      rePassword: "",
      otpId: 0,
      otp: "",
    };
    this.submit = this.submit.bind(this);
  }
  handleChange = (event) => {
    const target = event.target;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };
  handleChange2 = (value, name) => {
    this.setState({
      [name]: value,
    });
  };
  reset = () => {
    this.setState({
      comfirm: false,
      newPhonenumber: "",
      password: "",
      rePassword: "",
      otpId: 0,
      otp: "",
    });
  };
  async submit(e) {
    e.preventDefault();
    let token = await cookie.load("token");
    if (this.state.comfirm) {
      console.log({
        NewPhoneNumber: this.state.newPhonenumber,
        OTPID: this.state.otp,
        Code: this.state.otpId,
      });
      let rs = await axios
        .post(
          `${Config.host}/api/check-change-phone-otp/${
            local.get("user").userID
          }`,
          {
            NewPhoneNumber: this.state.newPhonenumber,
            OTPID: parseInt(this.state.otp),
            Code: this.state.otpId.toString(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .catch((rs) => helper.toast("warning", "Có lỗi từ phía server"));
      console.log(rs);
      if (rs.data.statusCode == 200) {
        helper.toast("success", rs.data.message);
        this.reset();
      } else {
        helper.toast("warning", rs.data.message);
        this.reset();
      }
    } else {
      let rs = await axios.post(
        `${Config.host}/api/otp/change-phone/${local.get("user").userID}`,
        {
          NewPhoneNumber: this.state.newPhonenumber,
          CurrentPassword: this.state.password,
          ConfirmPassword: this.state.rePassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (rs.data.statusCode == 200) {
        helper.toast("success", "Nhập mã otp bạn vừa nhận được");
        this.setState({ comfirm: true, otpId: rs.data.data.otpid });
      } else {
        console.log(rs.data);
        helper.toast("warning", rs.data.message);
      }
    }
  }

  render() {
    return (
      <form className="container py-5 div-login" onSubmit={this.submit}>
        {this.state.comfirm ? (
          <div className="row justify-content-center">
            <div className="col-md-8 mb-2 row justify-content-center">
              <div className="col-md-6 mb-2">
                <Widgets.Text
                  type="text"
                  required={true}
                  label={"Mã OTP"}
                  value={this.state.otp}
                  onChange={(e) => this.handleChange2(e, "otp")}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-md-8 mb-2 row justify-content-center">
              <div className="col-md-6 mb-2">
                <Widgets.Text
                  type="text"
                  required={true}
                  label={"Số điện thoại mới"}
                  value={this.state.newPhonenumber}
                  onChange={(e) => this.handleChange2(e, "newPhonenumber")}
                />
              </div>
            </div>
            <div className="col-md-8 mb-2 row justify-content-center">
              <div className="col-md-6 mb-2">
                <Widgets.Text
                  type="password"
                  required={true}
                  label={"Mật khẩu"}
                  value={this.state.password}
                  onChange={(e) => this.handleChange2(e, "password")}
                />
              </div>
            </div>
            <div className="col-md-8 mb-2 row justify-content-center">
              <div className="col-md-6 mb-2">
                <Widgets.Text
                  type="password"
                  required={true}
                  label={"Nhập lại mật khẩu"}
                  value={this.state.rePassword}
                  onChange={(e) => this.handleChange2(e, "rePassword")}
                />
              </div>
            </div>
          </div>
        )}

        <div className="col-md-12 mb-2 row justify-content-center">
          <button className="btn btn-info col-2" type="submit">
            Lưu
          </button>
        </div>
      </form>
    );
  }
}

export default ChangePhoneNumber;
