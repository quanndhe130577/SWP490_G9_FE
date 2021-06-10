import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Avatar from "react-avatar-edit";
import axios from "axios";
import helper from "../../../../services/helper";
import local from "../../../../services/local";
import Config from "../../../../services/config";
import cookie from "react-cookies";
import Widgets from "../../../../schema/Widgets";

class NormalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: null,
      lastname: null,
      dob: new Date(),
      identifyCode: null,
      avatar: "https://via.placeholder.com/150",
      preview: null,
    };
    this.submit = this.submit.bind(this);
  }
  componentDidMount() {
    let user = local.get("user");
    let token = cookie.load("token");
    axios
      .get(`${Config.host}/api/getUserInfo/${user.userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((rs) => {
        console.log(rs);
        this.setState({
          firstname: rs.data.data.firstName,
          lastname: rs.data.data.lastname,
          dob: new Date(rs.data.data.dob),
          identifyCode: rs.data.data.identifyCode,
          avatar:
            rs.data.data.avatar == null
              ? "https://via.placeholder.com/150"
              : rs.data.data.avatar,
        });
      })
      .catch((rs) => helper.toast("warning", "System error"));
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
    console.log(this.state);
    let token = await cookie.load("token");
    let rs = await axios.put(
      `${Config.host}/api/update/${local.get("user").userID}`,
      {
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        dob: this.state.dob,
        identifyCode: this.state.identifyCode,
        avatar: this.state.avatar,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (rs.data.success) {
      helper.toast("success", rs.data.message);
    } else {
      helper.toast("warning", rs.data.message);
    }
  }

  render() {
    let minDate = new Date(-8640000000000000);
    return (
      <div className="container h-100 mb-5">
        <form className="row" onSubmit={this.submit}>
          <div className="col-md-4 mb-2">
            <div className="img-fluid w-100 d-flex justify-content-center">
              <img
                src={this.state.avatar}
                className="cover-img w-75"
                alt="Preview"
                data-toggle="modal"
                data-target="#exampleModal"
              />
            </div>
          </div>
          <div className="col-md-8 row">
            <div className="col-md-6 mb-2">
              {/* <label className="form-label text-muted">Họ</label>
              <input
                type="text"
                className="form-control"
                name="firstname"
                value={this.state.firstname}
                onChange={this.handleChange}
                placeholder="Họ"
                required
              /> */}
              <Widgets.Text
                required={true}
                label={"Họ"}
                value={this.state.firstname}
                onChange={(e) => this.handleChange2(e, "firstname")}
              />
            </div>
            <div className="col-md-6 mb-2">
              {/* <label className="form-label text-muted">Tên</label>
              <input
                type="text"
                className="form-control"
                value={this.state.lastname}
                name="lastname"
                onChange={this.handleChange}
                placeholder="Tên"
                required
              /> */}
              <Widgets.Text
                required={true}
                label={"Tên"}
                value={this.state.lastname}
                onChange={(e) => this.handleChange2(e, "lastname")}
              />
            </div>
            <div className="col-md-6 mb-2">
              {/* <label className="form-label text-muted">Ngày sinh</label>
              <DatePicker
                className="form-control"
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                isClearable
                selected={this.state.dob}
                onChange={(value) => {
                  this.setState({ dob: value });
                }}
                placeholderText="Ngày sinh"
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required
              /> */}
              <Widgets.DateTimePicker
                required={true}
                label={"Ngày sinh"}
                value={this.state.dob}
                // maxDate={new Date()}
                // minDate={minDate}
                onChange={(data) => this.setState({ dob: data })}
              />
            </div>
            <div className="col-md-6 mb-2">
              {/* <label className="form-label text-muted">CCCD/CMND</label>
              <input
                type="text"
                className="form-control"
                placeholder="CCCD/CMND"
                value={this.state.identifyCode}
                name="identifyCode"
                onChange={this.handleChange}
                required
              /> */}
              <Widgets.Text
                required={true}
                label={"CCCD/CMND"}
                value={this.state.identifyCode}
                onChange={(e) => this.handleChange2(e, "identifyCode")}
              />
            </div>
          </div>

          <div className="col-md-12 mb-2 row justify-content-center">
            <button className="btn btn-info col-4" type="submit">
              Lưu
            </button>
          </div>
        </form>
        <div
          className="modal fade"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                  Chọn một ảnh để thay ảnh đại diện
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div className="container">
                  <label className="form-label text-muted"></label>
                  <div className="container">
                    <Avatar
                      width={300}
                      height={240}
                      onCrop={(preview) => this.setState({ preview })}
                      onClose={() =>
                        this.setState({ preview: this.state.avatar })
                      }
                      onBeforeFileLoad={(elem) => {
                        console.log(elem.target.files);
                      }}
                      className="update-userInfo-avatar"
                    />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-dismiss="modal"
                  onClick={() => this.setState({ avatar: this.state.preview })}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NormalInfo;
