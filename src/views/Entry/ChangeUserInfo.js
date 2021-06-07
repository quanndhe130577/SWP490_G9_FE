import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Avatar from "react-avatar-edit";
import "./ChangeUserInfo.css";

class ChangeUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "demo",
      lastname: "demo",
      dob: new Date("01/01/1999"),
      identifyCode: "030099005068",
      avatar: "https://via.placeholder.com/150",
      preview: "https://via.placeholder.com/150",
    };
  }
  handleChange = (event) => {
    const target = event.target;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };
  submit(e) {
    e.preventDefault();
  }

  render() {
    console.log(this.state);
    return (
      <div className="container">
        <div class="col-12 mt-3">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active" aria-current="page">
                Chỉnh sửa thông tin người dùng
              </li>
            </ol>
          </nav>
        </div>
        <form className="row container" onSubmit={this.submit}>
          <div className="col-6 mb-2">
            <label className="form-label text-muted">Ảnh đại diện</label>
            <div className="img-fluid w-75">
              <img
                src={this.state.preview}
                className="cover-img"
                alt="Preview"
              />
            </div>
          </div>
          <div className="col-6 mb-2">
            <label className="form-label text-muted">
              Chọn một ảnh để thay ảnh đại diện
            </label>
            <div className="input-group">
              <Avatar
                width={390}
                height={295}
                onCrop={(preview) => this.setState({ preview })}
                onClose={() => this.setState({ preview: this.state.avatar })}
                onBeforeFileLoad={(elem) => {
                  console.log(elem.target.files);
                }}
              />
            </div>
          </div>
          <div className="col-6 mb-2">
            <label className="form-label text-muted">Họ</label>
            <input
              type="text"
              className="form-control"
              name="firstname"
              value={this.state.firstname}
              onChange={this.handleChange}
              placeholder="Họ"
              onInvalid={(event) =>
                event.target.setCustomValidity("Họ không được để trống")
              }
              required
            />
          </div>
          <div className="col-6 mb-2">
            <label className="form-label text-muted">Tên</label>
            <input
              type="text"
              className="form-control"
              value={this.state.lastname}
              name="lastname"
              onChange={this.handleChange}
              placeholder="Tên"
              onInvalid={(event) =>
                event.target.setCustomValidity("Tên không được để trống")
              }
              required
            />
          </div>
          <div className="col-6 mb-2 d-flex flex-column">
            <label className="form-label text-muted">Ngày sinh</label>
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
              onInvalid={(event) =>
                event.target.setCustomValidity("Ngày sinh không được để trống")
              }
              required
            />
          </div>
          <div className="col-6 mb-2">
            <label className="form-label text-muted">CCCD/CMND</label>
            <input
              type="text"
              className="form-control"
              placeholder="CCCD/CMND"
              value={this.state.identifyCode}
              name="identifyCode"
              onChange={this.handleChange}
              onInvalid={(event) =>
                event.target.setCustomValidity("CCCD/CMND không được để trống")
              }
              required
            />
          </div>
          <div className="col-12 mb-2">
            <button className="btn btn-success" type="submit">
              Lưu
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ChangeUserInfo;
