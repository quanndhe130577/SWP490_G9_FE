import React, {Component} from "react";
import {Calendar, Card} from "antd";
import {Row, Col} from "reactstrap";
import {Modal} from "antd";
import moment from "moment";
import i18n from "i18next";
import EmployeeSalaryDetail from './EmployeeSalaryDetail'
import './EmployeeSalary.scss';

export default class EmployeeSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      times: [],
      currentDate: moment(),
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    if (this.state.currentDate._d.getYear() === value._d.getYear()) {
      this.setState({
        currentDate: value,
        isShow: true,
      });
    } else {
      this.setState({
        currentDate: value,
      });
    }
  }
  renderTitle = () => {
    let {total} = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("EmployeeSalary")}</h3>
          <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
        </Col>
      </Row>
    );
  };
  onCancel = () => {
    this.setState({isShow: false});
  };
  render() {
    return (
      <>
        <Modal
          width='auto'
          title="Quản lý lương"
          footer={null}
          visible={this.state.isShow}
          onCancel={this.onCancel}
        >
          <EmployeeSalaryDetail date={this.state.currentDate} />
        </Modal>
        <Card title={this.renderTitle()}>
          <Row>
            <Col style={{overflowX: "auto"}}>
              <Calendar
                mode='year'
                validRange={[moment("01-01-2020", "MM-DD-YYYY"), moment()]}
                onSelect={this.onChange}
                value={this.state.currentDate}
              />
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}
