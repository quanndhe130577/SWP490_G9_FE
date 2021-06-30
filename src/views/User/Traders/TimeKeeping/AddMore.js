import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Checkbox, Button } from "antd";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";

export default class AddMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      money: 1000000,
      employees: [],
    };
    this.submit = this.submit.bind(this);
  }
  componentDidMount() {
    this.setState({
      employees: this.props.employees.map((emp) => {
        return { id: emp.id, checked: false, name: emp.name };
      }),
    });
  }
  componentDidUpdate(props) {
    if (this.props.employees.length !== props.employees.length) {
      this.setState({
        employees: this.props.employees.map((emp) => {
          return { id: emp.id, checked: false, name: emp.name };
        }),
      });
    }
  }
  handleChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  };
  onChange = (checked, item) => {
    let emps = this.state.employees;
    emps.filter((e) => e.id === item.id)[0].checked = checked;
    this.setState({ employees: emps });
  };
  async submit() {
    let emps = this.state.employees.filter((e) => e.checked === true);
    for (let key in emps) {
      await apis.createTimeKeeping(
        {
          WorkDay: this.props.currentDate,
          Status: 1,
          Money: this.state.money,
          Note: 0,
          EmpId: emps[key].id,
        },
        "POST"
      );
      this.setState({ employees: [] });
      this.props.load();
    }
  }
  render() {
    const checkbox = this.state.employees.map((item) => (
      <Checkbox.Group>
        <Row key={item.id}>
          <Col>
            <Checkbox
              value={false}
              onChange={(event) => this.onChange(event.target.checked, item)}
            >
              {item.name}
            </Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
    ));
    return (
      <Row>
        <Col md="6" xs="12">
          <Widgets.Custom label={"employee"} component={checkbox} />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Text
            label={"money"}
            value={this.state.money}
            onChange={(e) => this.handleChange(e, "money")}
          />
        </Col>
        <Col md="6" xs="12">
          <Button type="primary" onClick={this.submit}>
            Lưu
          </Button>
        </Col>
      </Row>
    );
  }
}
