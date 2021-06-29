import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Checkbox } from "antd";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";

export default class AddMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      money: 10000,
      employees: [],
    };
  }
  handleChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  };
  onChange = (checked, item) => {
    let emps = this.state.employees;
    if (checked) {
      emps.push(item.id);
    } else {
      emps = emps.filter((id) => id != item.id);
    }
    this.setState({ employees: emps });
  };
  render() {
    console.log(this.state.employees);
    const checkbox = this.props.employees.map((item) => (
      <Checkbox.Group>
        <Row>
          <Col>
            <Checkbox
              key={item.id}
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
      </Row>
    );
  }
}
