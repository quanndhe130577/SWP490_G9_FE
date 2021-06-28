import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";

export default class TimeKeepingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workDay: new Date(),
      status: this.props.data.status,
      money: this.props.data.money,
      note: this.props.data.note,
      empId: this.props.data.empId,
    };
    this.submit = this.submit.bind(this);
  }
  handleChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  };
  async submit() {
    let time = this.state.time;
    time.note--;
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
    this.getTimes();
  }
  render() {
    console.log(this.state);
    return (
      <Row>
        <Col md="6" xs="12">
          <Widgets.Select
            label={"note" + this.state.note++}
            value={this.state.note}
            onChange={(e) => this.handleChange(e, "note")}
            items={[
              { id: 1, name: "Đã thanh toán" },
              { id: 2, name: "Chưa thanh toán" },
            ]}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Select
            label={"Employee"}
            value={this.state.empId}
            onChange={(e) => this.handleChange(e, "empId")}
            items={this.props.employees}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Text
            label={"status"}
            value={this.state.status}
            onChange={(e) => this.handleChange(e, "status")}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Text
            label={"money"}
            value={this.state.money}
            onChange={(e) => this.handleChange(e, "money")}
          />
        </Col>
      </Row>
    );
  }
}
