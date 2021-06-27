import React, { Component } from "react";
import { Row, Col } from "reactstrap";
// import Widgets from "../../../../schema/Widgets";
// import Modal from "../../../../containers/Antd/ModalCustom";
import { Calendar, Badge, Button, Modal } from "antd";
import apis from "../../../../services/apis";
import "./TimeKeeping.scss";
export default class TimeKeeping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      time: {
        workDay: new Date(),
        status: null,
        money: null,
        note: null,
        empId: null,
      },
      times: [],
      employees: [],
      currentDate: new Date(),
    };
    this.submit = this.submit.bind(this);
  }
  componentDidMount() {
    this.getEmployee();
    this.getTimes();
  }
  handleChange = (value, name) => {
    let time = this.state.time;
    time[name] = value;
    this.setState({
      time: time,
    });
  };
  async getEmployee() {
    let rs = await apis.getAllEmployee({}, "GET");
    this.setState({
      employees: rs.data.listEmployee.map((emp) => {
        emp.name = emp.firstName + " " + emp.lastName;
        return emp;
      }),
    });
  }
  async getTimes() {
    let rs = await apis.getTimeKeepingByTrader({}, "GET");
    this.setState({
      times: rs.data.map((time) => {
        time.workDay = new Date(time.workDay);
        return time;
      }),
    });
  }
  dateCellRender = (value) => {
    let date = value._d.getDate();
    let month = value._d.getMonth();
    let year = value._d.getFullYear();
    return (
      <>
        <Button type="link" className="button-text-primary">
          Link Button
        </Button>
        <ul className="events">
          {this.state.times
            .filter(
              (t) =>
                t.workDay.getDate() === date &&
                t.workDay.getMonth() === month &&
                t.workDay.getFullYear() === year
            )
            .map((item) => (
              <li key={item.name}>
                <Badge
                  color={item.note === 0 ? "blue" : "volcano"}
                  text={item.empName}
                />
              </li>
            ))}
        </ul>
      </>
    );
  };

  select = (date) => {
    let time = this.state.time;
    time.workDay = date._d;
    this.setState({ isShow: true, currentDate: date._d, time: time });
  };
  async submit() {
    let time = this.state.time;
    time.note = parseInt(time.note);
    let rs = await apis.createTimeKeeping(
      {
        WorkDay: time.workDay,
        Status: time.status,
        Money: time.money,
        Note: time.note,
        EmpId: time.empId,
      },
      "POST"
    );
    console.log(rs);
    this.getTimes();
  }
  render() {
    return (
      <>
        <Calendar dateCellRender={this.dateCellRender} onSelect={this.select} />
        <Modal
          width="100%"
          title="Basic Modal"
          visible={this.state.isShow}
          onCancel={() => this.setState({ isShow: false })}
          // onCancel={handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
        {/* <Modal
          title="Basic Modal"
          visible={this.state.isShow}
          onCancel={() => this.setState({ isShow: false })}
          onOk={this.submit}
          component={() => (
            <Row>
              <Col md="6" xs="12">
                <Widgets.Select
                  label={"note"}
                  value={this.state.time.note}
                  onChange={(e) => this.handleChange(e, "note")}
                  items={[
                    { name: "Đã thanh toán" },
                    { name: "Chưa thanh toán" },
                  ]}
                />
              </Col>
              <Col md="6" xs="12">
                <Widgets.Select
                  label={"status"}
                  value={this.state.time.status}
                  onChange={(e) => this.handleChange(e, "empId")}
                  items={this.state.employees}
                />
              </Col>
              <Col md="6" xs="12">
                <Widgets.Text
                  label={"status"}
                  value={this.state.time.status}
                  onChange={(e) => this.handleChange(e, "status")}
                />
              </Col>
              <Col md="6" xs="12">
                <Widgets.Text
                  label={"money"}
                  value={this.state.time.money}
                  onChange={(e) => this.handleChange(e, "money")}
                />
              </Col>
            </Row>
          )}
        /> */}
      </>
    );
  }
}
