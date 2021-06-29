import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Button } from "antd";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";

export default class TimeKeepingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workDay: this.props.data.workDay,
      status: this.props.data.status,
      money: this.props.data.money,
      note: this.props.data.note,
      empId: this.props.data.empId,
    };
    this.submit = this.submit.bind(this);
    this.delete = this.delete.bind(this);
  }
  componentDidUpdate(prevProps) {
    console.log(this.props);
    if (prevProps.data.workDay !== this.props.data.workDay) {
      this.setState({
        id: this.props.data.id,
        workDay: this.props.data.workDay,
        status: this.props.data.status,
        money: this.props.data.money,
        note: this.props.data.note,
        empId: this.props.data.empId,
      });
    }
  }
  handleChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  };
  async submit() {
    let time = this.state;
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
    console.log(rs)
    this.props.load();
  }
  async delete() {
    let rs = await apis.deleteTimeKeepingByTrader(
      {},
      "POST",
      this.props.data.id
    );
    await this.props.load();
  }
  render() {
    return (
      <Row>
        <Col md="6" xs="12">
          <Widgets.Select
            label={"note"}
            value={this.state.note++}
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
        <Col md="6" xs="12">
          <Button className="tnrss-btn-137d8d" onClick={this.submit}>
            Lưu
          </Button>
        </Col>
        <Col md="6" xs="12">
          <Button className="tnrss-btn-volcano" onClick={this.delete}>
            Xoá
          </Button>
        </Col>
      </Row>
    );
  }
}
