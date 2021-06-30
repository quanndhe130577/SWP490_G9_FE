import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Button, Checkbox, Radio, message } from "antd";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";

export default class TimeKeepingDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.data.id,
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
  changeNote = (event) => {
    this.setState({ note: event.target.checked ? 0 : 1 });
  };
  changeStatus = (event) => {
    this.setState({ status: event.target.value });
  };
  async submit() {
    let time = this.state;
    let rs = await apis.updateTimeKeeping(
      {
        id: time.id,
        WorkDay: time.workDay,
        Status: time.status,
        Money: time.money,
        Note: time.note,
        EmpId: time.empId,
      },
      "POST"
    );
    if (rs) {
      message.success("Cập nhật thành công");
    }
    this.props.load();
  }
  async delete() {
    await apis.deleteTimeKeepingByTrader({}, "POST", this.props.data.id);
    if (rs) {
      await this.props.load();
    }
  }
  render() {
    return (
      <Row>
        <Col md="4" xs="12">
          <Widgets.Text
            label={"money"}
            value={this.state.money}
            onChange={(e) => this.handleChange(e, "money")}
          />
        </Col>
        <Col md="4" xs="12">
          <Widgets.Custom
            label={"status"}
            component={
              <Radio.Group
                value={this.state.status}
                onChange={this.changeStatus}
              >
                <Radio value={0.5}>Nửa công</Radio>
                <Radio value={1}>Một công</Radio>
              </Radio.Group>
            }
          />
        </Col>
        <Col md="4" xs="12">
          <Widgets.Custom
            label={"note"}
            value={this.state.note}
            onChange={(e) => this.handleChange(e, "note")}
            component={
              <Checkbox
                checked={this.state.note === 0}
                onChange={this.changeNote}
              />
            }
          />
        </Col>
        <Col md="6" xs="12">
          <Button className="tnrss-btn-primary mr-2" onClick={this.submit}>
            Lưu
          </Button>
          <Button className="tnrss-btn-volcano" onClick={this.delete}>
            Xoá
          </Button>
        </Col>
      </Row>
    );
  }
}
