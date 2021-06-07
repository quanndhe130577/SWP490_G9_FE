import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Avatar from "react-avatar-edit";

class NormalInfo extends Component {
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
    return (
      <form className="row" onSubmit={this.submit}>
        <div className="col-md-6 mb-2">
          <label className="form-label text-muted">Ảnh đại diện</label>
          <div className="img-fluid w-75">
            <img src={this.state.preview} className="cover-img" alt="Preview" />
          </div>
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label text-muted">
            Chọn một ảnh để thay ảnh đại diện
          </label>
          <div className="input-group">
            <Avatar
              width={320}
              height={250}
              onCrop={(preview) => this.setState({ preview })}
              onClose={() => this.setState({ preview: this.state.avatar })}
              onBeforeFileLoad={(elem) => {
                console.log(elem.target.files);
              }}
            />
          </div>
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label text-muted">Họ</label>
          <input
            type="text"
            className="form-control"
            name="firstname"
            value={this.state.firstname}
            onChange={this.handleChange}
            placeholder="Họ"
            required
          />
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label text-muted">Tên</label>
          <input
            type="text"
            className="form-control"
            value={this.state.lastname}
            name="lastname"
            onChange={this.handleChange}
            placeholder="Tên"
            required
          />
        </div>
        <div className="col-md-6 mb-2 d-flex flex-column">
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
            required
          />
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label text-muted">CCCD/CMND</label>
          <input
            type="text"
            className="form-control"
            placeholder="CCCD/CMND"
            value={this.state.identifyCode}
            name="identifyCode"
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="col-md-12 mb-2 row justify-content-center">
          <button className="btn btn-success col-6" type="submit">
            Lưu
          </button>
        </div>
      </form>
    );
  }
}

export default NormalInfo;
