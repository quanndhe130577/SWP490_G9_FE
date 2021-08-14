import React, { Component } from "react";
import Avatar from "react-avatar-edit";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import Widgets from "../../../../schema/Widgets";
import { Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import apis from "../../../../services/apis";

class NormalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: null,
      lastName: null,
      dob: new Date(),
      identifyCode: null,
      avatar: "https://via.placeholder.com/150",
      preview: null,
      isRender: true,
      loading: false,
      display: false,
    };
    this.submit = this.submit.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);
  }
  componentDidMount() {
    this.getUserInfo();
  }
  async getUserInfo() {
    let user = session.get("user");
    let rs = await apis.getUserInfo({}, "GET", user.userID);
    this.setState({
      firstname: rs.data.firstName,
      lastName: rs.data.lastName,
      dob: new Date(rs.data.dob),
      identifyCode: rs.data.identifyCode,
      avatar:
        rs.data.avatar == null
          ? "https://via.placeholder.com/150"
          : rs.data.avatar,
      isRender: false,
    });
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
    let rs = await apis.updateUser(
      {
        firstname: this.state.firstname,
        lastName: this.state.lastName,
        dob: this.state.dob,
        identifyCode: this.state.identifyCode,
        avatarBase64: this.state.avatar.split(",")[1],
      },
      "POST",
      session.get("user").userID
    );
    this.setState({ loading: false });
    if (rs.success) {
      helper.toast("success", rs.message);
      let user = session.get("user");
      user.avatar = rs.data.avatar;
      session.set("user", JSON.stringify(user));
    } else {
      helper.toast("warning", rs.message);
    }
  }

  render() {
    if (this.state.isRender) {
      return (
        <div className=" d-flex justify-content-center">
          <LoadingOutlined />
        </div>
      );
    }
    return (
      <div className="container py-5 div-login">
        <form className="row" onSubmit={this.submit}>
          <div className="col-md-4 mb-2">
            <div className="img-fluid w-100 d-flex justify-content-center">
              <img
                src={this.state.avatar}
                className="cover-img w-75"
                alt="Preview"
                onClick={() => this.setState({ display: true })}
              />
            </div>
          </div>
          <div className="col-md-8 row">
            <div className="col-md-6 mb-2">
              <Widgets.Text
                required={true}
                label={"Họ"}
                value={this.state.firstname}
                onChange={(e) => this.handleChange2(e, "firstname")}
              />
            </div>
            <div className="col-md-6 mb-2">
              <Widgets.Text
                required={true}
                label={"Tên"}
                value={this.state.lastName}
                onChange={(e) => this.handleChange2(e, "lastName")}
              />
            </div>
            <div className="col-md-6 mb-2">
              <Widgets.DateTimePicker
                required={true}
                label={"Ngày sinh"}
                value={this.state.dob}
                onChange={(data) => {
                  this.setState({ dob: new Date(data) });
                }}
              />
            </div>
            <div className="col-md-6 mb-2">
              <Widgets.Text
                required={true}
                label={"CCCD/CMND"}
                value={this.state.identifyCode}
                onChange={(e) => this.handleChange2(e, "identifyCode")}
              />
            </div>
            <div className="col-md-12">
              <button
                className="btn btn-info px-5"
                type="submit"
                disabled={this.state.loading}
              >
                {this.state.loading ? <LoadingOutlined /> : "Lưu"}
              </button>
            </div>
          </div>
        </form>
        <Modal title="Đổi ảnh đại diện" visible={this.state.display}
          onOk={() => this.setState({ avatar: this.state.preview, display: false })}
          onCancel={() => this.setState({ display: false })}>
          <div className="container">
            <label className="form-label text-muted"></label>
            <div className="container d-flex justify-content-center">
              <Avatar
                width={300}
                height={240}
                onCrop={(preview) => this.setState({ preview })}
                onClose={() =>
                  this.setState({ preview: this.state.avatar })
                }
                onBeforeFileLoad={(elem) => { }}
                label="Chọn một ảnh"
                className="update-userInfo-avatar"
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default NormalInfo;
