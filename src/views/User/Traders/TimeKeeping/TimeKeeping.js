import React, {Component} from "react";
import {Calendar, Card, Button, Select} from "antd";
import {
  UsergroupDeleteOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import {Row, Col} from "reactstrap";
import Widgets from "../../../../schema/Widgets";
import moment from "moment";
import CurrentEmps from "./CurrentEmps";
import apis from "../../../../services/apis";
import "./TimeKeeping.scss";
import i18n from "i18next";

export default class TimeKeeping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      currentTimes: [],
      times: [],
      employees: [],
      currentDate: moment(),
      mode: 'month'
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
    if (this.state.mode === 'year') {
      this.setState({
        currentDate: value,
        mode: 'month'
      });
      return;
    }
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
    this.setState({isShow: false});
  };
  renderTitle = () => {
    let {total} = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("TimekeepingManagement")}</h3>
          <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
        </Col>
      </Row>
    );
  };
  onPanelChange = (date, mode) => {
    this.setState({mode: mode});
  }
  render() {
    this.checkExitsEmp();
    return (
      <Card title={this.renderTitle()}>
        <CurrentEmps
          visible={this.state.isShow}
          cancel={this.onCancel}
          currentDate={this.state.currentDate._d}
          employees={this.state.employees}
          load={this.getTimes}
        />
        <Row>
          <Col style={{overflowX: "auto"}}>
            <Calendar
              mode={this.state.mode}
              dateCellRender={this.dateCellRender}
              validRange={[moment("01-01-2020", "MM-DD-YYYY"), moment()]}
              onSelect={this.onChange}
              value={this.state.currentDate}
              onPanelChange={this.onPanelChange}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
