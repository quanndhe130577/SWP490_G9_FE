import React, { Component } from "react";
import { Table } from "antd";
import helper from "../../../../../services/helper";
import Widgets from "../../../../../schema/Widgets";
import { Row, Col, Button } from "reactstrap";
import i18n from "i18next";
import apis from "../../../../../services/apis";
import helper from "../../../../../services/helper";
import session from "../../../../../services/session";
import ModalForm from "./ModalEMP";
import Moment from "react-moment";
import moment from "moment";
import "./EmployeeBaseSalary.scss";

export default class EmployeeBaseSalary extends Component {
  constructor(props) {
    super(props);
    this.state = { times: [] };
  }

  componentDidMount() {
    this.fetchEmployee();
  }
  componentDidUpdate(props) {
    if (props.date !== this.props.date) {
      this.getTimes();
    }
  }
  async getTimes() {
    let date = moment()._d;
    let rs = await apis.getSalaryDetailEmployee({}, "GET", date.toDateString());
    console.log(rs);
    if (rs) {
      this.setState({ times: rs.data });
    }
  }
  async paidTk(id) {
    let rs = await apis.paidTimeKeeping(
      { empId: id, workDay: this.props.date },
      "POST"
    );
    helper.toast("success", rs.message);
    if (rs) {
      this.getTimes();
    }
  }
  render() {
    let columns = [
      {
        title: "Nhân Viên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Lương",
        dataIndex: "salary",
        key: "salary",
        render: (data) => (
          <Widgets.NumberFormat
            needFormGroup={false}
            displayType="text"
            value={data}
          />
        ),
      },
      // {
      //   title:'Hành động',
      //   render:data=> <Button onClick={()=>this.paidTk(data.empId)} type="primary" disabled={data.notPaid===0}>Thanh toán</Button>
      // }
    ];
    return (
      <Card title={this.renderTitle()}>
        {isShowModal && mode !== "" && (
          <ModalForm
            isShow={isShowModal}
            mode={mode}
            closeModal={this.closeModal}
            currentEmp={currentEmp || {}}
          />
        )}
        <Row>
          <Col style={{ overflowX: "auto" }}>
            <Table
              bordered
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10 }}
              scroll={{ y: 600 }}
              loading={loading}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
