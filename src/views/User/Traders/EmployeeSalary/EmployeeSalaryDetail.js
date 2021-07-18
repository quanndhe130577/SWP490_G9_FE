import React, {Component} from "react";
import {Table, Card, Button, Row, Col} from 'antd';
import helper from "../../../../services/helper";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";

export default class EmployeeSalaryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {times: []};
    this.getTimes = this.getTimes.bind(this);
    this.paidTk=this.paidTk.bind(this)
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
    let date = this.props.date._d;
    let rs = await apis.getTimeKeepingByTraderWithMonth({}, "GET", date.toDateString());
    if (rs) {
      this.setState({
        times: rs.data.map((time) => {
          time.workDay = new Date(time.workDay);
          return time;
        })
      });
    }
  }
  paid(times) {
    let total = 0;
    times.filter(t => t.note === 0).forEach(t => total += t.money);
    return total;
  }
  notPaid(times) {
    let total = 0;
    times.filter(t => t.note === 1).forEach(t => total += t.money);
    return total;
  }
  employees = () => {
    let map = {};
    this.state.times.forEach(item => {
      if (map[item.empId] === undefined) {
        map[item.empId] = [];
        map[item.empId].push(item);
      } else {
        map[item.empId].push(item)
      }
    })
    let list = [];
    for (let id in map) {
      let paid = 0;
      let notPaid = 0;
      let dates = []
      let name = map[id][0].empName;
      let empId = map[id][0].empId;
      map[id].forEach(time => {
        if (time.note === 0) {
          paid += time.money;
        } else {
          notPaid += time.money;
          dates.push(time.workDay)
        }

      })
      let total=paid+notPaid;
      list.push({paid, notPaid, dates, name, empId, total})
    }
    return list;
  }
  async paidTk(id) {
    let rs = await apis.paidTimeKeeping({empId:id,workDay:this.props.date},"POST")
    helper.toast("success", rs.message);
    if(rs) {
      this.getTimes()
    }
  }
  render() {
    let paid = this.paid(this.state.times)
    let notPaid = this.notPaid(this.state.times)
    let employees = this.employees();
    let columns = [{
      title: 'Nhân Viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số tiền đã trả',
      dataIndex: 'paid',
      key: 'paid',
      render: data => <Widgets.NumberFormat neddFormGroup={false} displayType='text' value={data} />
    },
    {
      title: 'Nợ',
      dataIndex: 'notPaid',
      key: 'notPaid',
      render: data => <Widgets.NumberFormat neddFormGroup={false} displayType='text' value={data} />
    },
    {
      title: 'Tổng số tiền',
      dataIndex: 'total',
      key: 'total',
      render: data => <Widgets.NumberFormat neddFormGroup={false} displayType='text' value={data} />
    },
    {
      title:'Hành động',
      render:data=> <Button onClick={()=>this.paidTk(data.empId)} type="primary" disabled={data.notPaid===0}>Thanh toán</Button>
    }
    ];
    return (
      <>
        <Table dataSource={employees} columns={columns} bordered />
        <Row>
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
        </Row>
      </>
    );
  }
}