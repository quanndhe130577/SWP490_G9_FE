import React, {Component} from "react";
import {Statistic} from "antd";
import apis from "../../../../services/apis";

export default class EmployeeSalaryDetail extends Component {
  constructor(props) {
    super(props);
    this.state={times:[]}
    this.getTimes = this.getTimes.bind(this);
  }
  componentDidMount() {
      this.getTimes();
  }
  async getTimes() { 
    let date = this.props.date._d;
    let rs = await apis.getTimeKeepingByTraderWithMonth(
      {},
      "GET",
      date.toDateString()
    );
    if (rs) {
      this.setState({
        times: rs.data.map((time) => {
          time.workDay = new Date(time.workDay);
          return time;
        })
      });
    }
  }
  render() {
    return (
        <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Feedback" value={1128} prefix={<LikeOutlined />} />
        </Col>
        <Col span={12}>
          <Statistic title="Unmerged" value={93} suffix="/ 100" />
        </Col>
      </Row>
    );
  }
}
