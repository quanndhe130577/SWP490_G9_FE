import React, { Component } from "react";
import { Calendar, Button, Modal, Collapse, Typography } from "antd";
import moment from "moment";
import TimeKeepingDetail from "./TimeKeepingDetail";
import apis from "../../../../services/apis";
import "./TimeKeeping.scss";

export default class TimeKeeping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      currentTimes: [],
      times: [],
      employees: [],
      currentDate: new Date(),
    };
    this.getEmployee = this.getEmployee.bind(this);
    this.getTimes = this.getTimes.bind(this);
  }
  componentDidMount() {
    this.getEmployee();
    this.getTimes();
  }
  async getEmployee() {
    let rs = await apis.getEmployees({}, "GET");
    this.setState({
      employees: rs.data,
    });
  }
  async getTimes() {
    let date = new Date();
    let rs = await apis.getTimeKeepingByTrader({}, "GET", date.toDateString());
    this.setState({
      times: rs.data.map((time) => {
        time.workDay = new Date(time.workDay);
        return time;
      }),
      currentTimes: this.currentTimes(),
    });
  }
  currentTimes = () => {
    let date = this.state.currentDate.getDate();
    let month = this.state.currentDate.getMonth();
    let year = this.state.currentDate.getFullYear();
    return this.state.times.filter(
      (t) =>
        t.workDay.getDate() === date &&
        t.workDay.getMonth() === month &&
        t.workDay.getFullYear() === year
    );
  };
  dateCellRender = (value) => {
    let date = value._d.getDate();
    let month = value._d.getMonth();
    let year = value._d.getFullYear();
    let times = this.state.times.filter(
      (t) =>
        t.workDay.getDate() === date &&
        t.workDay.getMonth() === month &&
        t.workDay.getFullYear() === year
    );
    return (
      <>
        <Button
          type="link"
          className="tnrss-text-primary p-0"
          onClick={() => this.select(value._d, times)}
        >
          Xem chi tiết
        </Button>
        <ul className="events">
          <li key="number">
            <p className="tnrss-text-magenta">{`Tổng số nhân viên: ${times.length}`}</p>
          </li>
        </ul>
      </>
    );
  };
  select = (date, times) => {
    this.setState({ isShow: true, currentDate: date, currentTimes: times });
  };
  checkExitsEmp = () => {
    let emps = [];
    this.state.employees.forEach((emp) => {
      if (this.state.currentTimes.map((time) => time.empId).includes(emp.id)) {
        emps.push(emp);
      }
    });
    return emps.length !== this.state.employees.length;
  };
  mapEmp = () => {
    let emps = this.state.employees.filter((emp) => {
      let listCurrentEmp = this.state.currentTimes.map((t) => t.empId);
      return !listCurrentEmp.includes(emp.id);
    });
    return emps;
  };
  render() {
    this.checkExitsEmp();
    return (
      <>
        <Calendar
          dateCellRender={this.dateCellRender}
          validRange={[moment("01-01-2021", "MM-DD-YYYY"), moment()]}
        />
        <Modal
          width="100%"
          title="Basic Modal"
          visible={this.state.isShow}
          onCancel={() => this.setState({ isShow: false })}
        >
          <Collapse>
            {this.state.currentTimes.map((item) => (
              <Collapse.Panel
                header={
                  <Typography.Text type="success">{`${item.empName} ${item.status} công`}</Typography.Text>
                }
                key={item.id}
              >
                <TimeKeepingDetail
                  employees={this.mapEmp()}
                  data={item}
                  load={this.getTimes}
                />
              </Collapse.Panel>
            ))}
            {this.checkExitsEmp() && (
              <Collapse.Panel
                header="Thêm lịch"
                key={`${this.state.currentDate}`}
              >
                <TimeKeepingDetail
                  employees={this.mapEmp()}
                  data={{ workDay: this.state.currentDate, note: 0 }}
                  load={this.getTimes}
                />
              </Collapse.Panel>
            )}
          </Collapse>
        </Modal>
      </>
    );
  }
}
