import React, { Component } from "react";
import { Calendar, Modal } from "antd";
import { UsergroupDeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import CurrentEmps from "./CurrentEmps";
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
      currentDate: moment(),
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
    if (rs) {
      this.setState({
        employees: rs.data,
      });
    }
  }

  async getTimes() {
    let date = new Date();
    let rs = await apis.getTimeKeepingByTraderWithMonth(
      {},
      "GET",
      date.toDateString()
    );
    if (rs) {
      this.setState({
        times: rs.data.map((time) => {
          time.workDay = new Date(time.workDay);
          return time;
        }),
        currentTimes: this.currentTimes(this.state.currentDate._d),
      });
    }
  }

  currentTimes = (currentDate) => {
    let date = currentDate.getDate();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    return this.state.times.filter(
      (t) =>
        t.workDay.getDate() === date &&
        t.workDay.getMonth() === month &&
        t.workDay.getFullYear() === year
    );
  };
  dateCellRender = (value) => {
    let times = this.currentTimes(value._d);
    let currentDate = this.state.currentDate;
    if (currentDate._d.getMonth() === value._d.getMonth()) {
      return (
        <ul className="events">
          <li key="number" className="d-flex">
            <UsergroupDeleteOutlined className="tnrss-ts-2 tnrss-text-magenta pr-1" />
            <p className="">{`${times.length}`}</p>
          </li>
        </ul>
      );
    } else {
      return "";
    }
  };

  onChange = (value) => {
    if (
      this.state.currentDate._d.getMonth() === value._d.getMonth() &&
      this.state.currentDate._d.getYear() === value._d.getYear()
    ) {
      this.setState({
        currentDate: value,
        currentTimes: this.currentTimes(value._d),
        isShow: true,
      });
    } else {
      this.setState({
        currentDate: value,
        currentTimes: this.currentTimes(value._d),
      });
    }
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
          onChange={this.onChange}
          value={this.state.currentDate}
        />
        <Modal
          width="100%"
          title="Basic Modal"
          visible={this.state.isShow}
          onCancel={() => this.setState({ isShow: false })}
        >
          <CurrentEmps
            currentDate={this.state.currentDate._d}
            employees={this.state.employees}
            load={this.getTimes()}
          />
        </Modal>
      </>
    );
  }
}
