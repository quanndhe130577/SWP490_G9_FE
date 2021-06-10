import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import helper from "../../../../services/helper";
import local from "../../../../services/local";
import Config from "../../../../services/config";
import Widgets from "../../../../schema/Widgets";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comfirm: false,
      password: "",
      newPassword: "",
      rePassword: "",
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
  async submit(e) {
    e.preventDefault();
    // this.setState({ comfirm: true });
    let token = await cookie.load("token");
    let rs = await axios.put(
      `${Config.host}/api/change-password/${local.get("user").userID}`,
      {
        currentPassword: this.state.password,
        newpassword: this.state.newPassword,
        confirmPassword: this.state.rePassword,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (rs.data.statusCode) {
      helper.toast("success", "Cập nhật thành công");
    }
  }

  render() {
    return (
      <form className="container py-5 div-login" onSubmit={this.submit}>
        {this.state.comfirm ? (
          <div className="col-md-8 mb-2 row justify-content-center">
            <div className="col-md-6 mb-2">
              <Widgets.Text
                type="text"
                required={true}
                label={"Mã OTP"}
                onChange={(e) => this.handleChange2(e, "otp")}
              />
            </div>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-md-8 mb-2 row justify-content-center">
              <div className="col-md-6 mb-2">
                <Widgets.Text
                  type="password"
                  required={true}
                  label={"Mật khẩu"}
                  onChange={(e) => this.handleChange2(e, "password")}
                />
              </div>
            </div>
            <div className="col-md-8 mb-2 row justify-content-center">
              <div className="col-md-6 mb-2">
                <Widgets.Text
                  type="password"
                  required={true}
                  label={"Mật khẩu mới"}
                  onChange={(e) => this.handleChange2(e, "newPassword")}
                />
              </div>
            </div>
            <div className="col-md-8 mb-2 row justify-content-center">
              <div className="col-md-6 mb-2">
                <Widgets.Text
                  type="password"
                  required={true}
                  label={"Nhập lại mật khẩu mới"}
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

export default ChangePassword;
