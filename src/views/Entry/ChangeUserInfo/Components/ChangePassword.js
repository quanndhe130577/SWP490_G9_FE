import React, { Component } from "react";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comfirm: false,
      password: "",
      newPassword: "",
      otp: "",
    };
  }
  handleChange = (event) => {
    const target = event.target;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };
  submit = (e) => {
    e.preventDefault();
    this.setState({ comfirm: true });
  };

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
              <label className="form-label text-muted col-md-4">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="form-control col-md-8"
                name="newPassword"
                onChange={this.handleChange}
                placeholder="Mật khẩu mới"
                required
              />
            </div>
            <div className="row mb-2">
              <label className="form-label text-muted col-md-4">
                Nhập lại mật khẩu mới
              </label>
              <input
                type="password"
                className="form-control col-md-8"
                placeholder="Nhập lại mật khẩu mới"
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

export default ChangePassword;
