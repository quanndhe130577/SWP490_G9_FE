import React, { Component } from "react";
import { Calendar, Button, Modal, Collapse, Typography } from "antd";
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
  }
  componentDidMount() {
    this.getEmployee();
    this.getTimes();
  }
  async getEmployee() {
    let rs = await apis.getAllEmployee({}, "GET");
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
    });
  }
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
  render() {
    return (
      <>
        <Calendar dateCellRender={this.dateCellRender} />
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
                  employees={this.state.employees}
                  data={item}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </Modal>
      </>
    );
  }
}
