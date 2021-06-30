import React, { Component } from "react";
import { Collapse, Typography } from "antd";
import AddMore from "./AddMore";
import TimeKeepingDetail from "./TimeKeepingDetail";
import apis from "../../../../services/apis";
import "./TimeKeeping.scss";

export default class CurrentEmps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTimes: [],
    };
    this.getTimes = this.getTimes.bind(this);
  }

  componentDidMount() {
    this.getTimes();
  }
  componentDidUpdate(props) {
    if (this.props.currentDate !== props.currentDate) {
      this.getTimes();
    }
  }

  async getTimes() {
    let rs = await apis.getTimeKeepingByTraderWithDate(
      {},
      "GET",
      this.props.currentDate.toDateString()
    );
    if (rs) {
      this.setState({
        currentTimes: rs.data,
      });
    }
  }

  checkExitsEmp = () => {
    let emps = [];
    this.props.employees.forEach((emp) => {
      if (this.state.currentTimes.map((time) => time.empId).includes(emp.id)) {
        emps.push(emp);
      }
    });
    return emps.length !== this.props.employees.length;
  };
  mapEmp = () => {
    let emps = this.props.employees.filter((emp) => {
      let listCurrentEmp = this.state.currentTimes.map((t) => t.empId);
      return !listCurrentEmp.includes(emp.id);
    });
    return emps;
  };
  load() {
    this.getTimes();
    this.props.getTimes();
  }

  render() {
    return (
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
          <Collapse.Panel header="Thêm lịch" key={`${this.props.currentDate}`}>
            <AddMore
              employees={this.mapEmp()}
              currentDate={this.props.currentDate}
              load={this.getTimes}
            />
          </Collapse.Panel>
        )}
      </Collapse>
    );
  }
}
