import React, {Component} from "react";
import {Table, Card, Button, Row, Col} from 'antd';
import helper from "../../../../services/helper";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";
import moment from "moment";
import './EmployeeSalary.scss';

export default class EmployeeSalaryDetail extends Component {
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
      title: 'Số tiền đã trả',
      dataIndex: 'paid',
      key: 'paid',
      render: data => {
        console.log(data)
        return <Widgets.NumberFormat neddFormGroup={false} displayType='text' value={data} />
      }
    },
    {
      title: 'Nợ',
      dataIndex: 'notPaid',
      key: 'notPaid',
      render: data => <Widgets.NumberFormat neddFormGroup={false} displayType='text' value={data} />
    },
    {
      title: 'Lương',
      dataIndex: 'salary',
      key: 'salary',
      render: data => <Widgets.NumberFormat neddFormGroup={false} displayType='text' value={data} />
    },
    {
      title:'Hành động',
      render:data=> <Button onClick={()=>this.paidTk(data.empId)} type="primary" disabled={data.notPaid===0}>Thanh toán</Button>
    }
    ];
    return (
      <>
        <Table dataSource={this.state.times} columns={columns} bordered />
        {/* <Row>
          <Col span={8}>
            <Card title='Tổng số tiền đã trả'>
              <Widgets.NumberFormat displayType='text' className='py-2' value={paid} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title='Tổng số tiền chưa trả'>
              <Widgets.NumberFormat displayType='text' className='py-2' value={notPaid} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title='Tổng lương'>
              <Widgets.NumberFormat displayType='text' className='py-2' value={paid + notPaid} />
            </Card>
          </Col>
        </Row> */}
      </>
    );
  }
}
