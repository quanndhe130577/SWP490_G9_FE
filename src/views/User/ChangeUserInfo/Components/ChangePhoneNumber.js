import React, { Component } from "react";
import cookie from "react-cookies";
import axios from "axios";
import helper from "../../../../services/helper";
import local from "../../../../services/local";
import Config from "../../../../services/config";

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
      <form className="container" onSubmit={this.submit}>
        {this.state.comfirm ? (
          <div className="row mb-2">
            <label className="form-label text-muted col-md-4">Mã OTP</label>
            <input
              type="text"
              className="form-control col-md-8"
              name="otp"
              onChange={this.handleChange}
              placeholder="Mã OTP"
              required
            />
          </div>
        ) : (
          <>
            <div className="row mb-2">
              <label className="form-label text-muted col-md-4">
                Số điện thoại mới
              </label>
              <input
                type="text"
                className="form-control col-md-8"
                name="newPhonenumber"
                value={this.state.newPhonenumber}
                onChange={this.handleChange}
                placeholder="Số điện thoại mới"
                required
              />
            </div>
            <div className="row mb-2">
              <label className="form-label text-muted col-md-4">Mật khẩu</label>
              <input
                type="password"
                className="form-control col-md-8"
                name="password"
                onChange={this.handleChange}
                placeholder="Mật khẩu"
                required
              />
            </div>
            <div className="row mb-2">
              <label className="form-label text-muted col-md-4">Mật khẩu</label>
              <input
                type="password"
                className="form-control col-md-8"
                name="rePassword"
                onChange={this.handleChange}
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
          </>
        )}

        <div className="col-md-12 mb-2 row justify-content-center">
          <button className="btn btn-success col-6" type="submit">
            Lưu
          </button>
        </div>
      </form>
    );
  }
}

export default ChangePhoneNumber;
