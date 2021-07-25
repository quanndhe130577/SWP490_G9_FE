import React, {Component} from "react";
import {Table, Card, Button, Row, Col} from 'antd';
import helper from "../../../../services/helper";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";
import moment from "moment";
import './EmployeeHistorySalary.scss';

export default class EmployeeBaseSalary extends Component {
  constructor(props) {
    super(props);
    this.state = {times: []};
  }
  componentDidMount() {
    this.getTimes();
  }
  componentDidUpdate(props) {
    if (props.date !== this.props.date) {
      this.getTimes()
    }
  }
  async getTimes() {
    let date = moment()._d;
    let rs = await apis.getSalaryDetailEmployee({}, "GET", date.toDateString());
    console.log(rs)
    if (rs) {
      this.setState({times: rs.data});
    }
  }
  async paidTk(id) {
    let rs = await apis.paidTimeKeeping({empId:id,workDay:this.props.date},"POST")
    helper.toast("success", rs.message);
    if(rs) {
      this.getTimes()
    }
  }
  render() {
    let columns = [{
      title: 'Nhân Viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      render: data => <Widgets.NumberFormat neddFormGroup={false} displayType='text' value={data} />
    },
    {
      title: 'Tháng',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title:'Hành động',
      render:data=> <Button onClick={()=>this.paidTk(data.empId)} type="primary" disabled={data.notPaid===0}>Thanh toán</Button>
    }
    ];
    return (
      <>
        <Table dataSource={this.state.times} columns={columns} bordered />
      </>
    );
  }
}
