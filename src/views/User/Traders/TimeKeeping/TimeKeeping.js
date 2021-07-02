import React, { Component } from "react";
import { Calendar } from "antd";
import {
  UsergroupDeleteOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import Widgets from "../../../../schema/Widgets";
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
    this.getTimes2 = this.getTimes2.bind(this);
    this.onChange = this.onChange.bind(this);
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
    let date = this.state.currentDate._d;
    let rs = await apis.getTimeKeepingByTraderWithMonth(
      {},
      "GET",
      date.toDateString()
    );
    console.log(rs);
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

  async getTimes2(date) {
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
      if (times.length !== 0) {
        let money = 0;
        times.forEach((item) => {
          money += item.money;
        });
        return (
          <ul className="events">
            <li key="number" className="d-flex">
              <UsergroupDeleteOutlined className="tnrss-ts-2 tnrss-text-danger px-1" />
              <p className="">{`${times.length}`}</p>
            </li>
            <li key="status" className="d-flex">
              <DollarCircleOutlined className="tnrss-ts-2 tnrss-text-warning px-1" />
              {/* <p className="">{`${money}`}</p> */}
              <Widgets.NumberFormat displayType="text" value={money} />
            </li>
          </ul>
        );
      }
    } else {
      return "";
    }
  };

  onChange(value) {
    if (
      this.state.currentDate._d.getMonth() === value._d.getMonth() &&
      this.state.currentDate._d.getYear() === value._d.getYear()
    ) {
      this.setState({
        currentDate: value,
        isShow: true,
      });
      this.getTimes2(value._d);
    } else {
      this.setState({
        currentDate: value,
      });
      this.getTimes2(value._d);
    }
  }
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
  onCancel = () => {
    this.setState({ isShow: false });
  };
  render() {
    this.checkExitsEmp();
    return (
      <>
        <Calendar
          dateCellRender={this.dateCellRender}
          validRange={[moment("01-01-2021", "MM-DD-YYYY"), moment()]}
          onSelect={this.onChange}
          value={this.state.currentDate}
        />
        <CurrentEmps
          visible={this.state.isShow}
          cancel={this.onCancel}
          currentDate={this.state.currentDate._d}
          employees={this.state.employees}
          load={this.getTimes}
        />
      </>
    );
  }
}
