import React, { Component } from "react";
import { LoadingOutlined, RightSquareTwoTone } from "@ant-design/icons";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import apis from "../../../../services/apis";
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
      loading: false,
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
    this.setState({ loading: true });
    let rs = await apis.changePassword(
      {
        currentPassword: this.state.password,
        newpassword: this.state.newPassword,
        confirmPassword: this.state.rePassword,
      },
      "POST",
      session.get("user").userID
    );
    this.setState({ loading: false });
    if (rs) {
      this.setState({
        password: "",
        newPassword: "",
        rePassword: "",
      });
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
                  value={this.state.password}
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
                  value={this.state.newPassword}
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
                  value={this.state.rePassword}
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
          <button className="btn btn-info px-5" type="submit">
            {this.state.loading ? <LoadingOutlined /> : "Lưu"}
          </button>
        </div>
      </form>
    );
  }
}

export default ChangePassword;
