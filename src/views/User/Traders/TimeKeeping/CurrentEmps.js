import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { Checkbox, Modal, List, Radio } from "antd";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";
import "./TimeKeeping.scss";

export default class CurrentEmps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTimes: [],
    };
    this.getTimes = this.getTimes.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.getTimes();
  }
  componentDidUpdate(props) {
    if (this.props.currentDate !== props.currentDate) {
      this.getTimes();
    }
    // if(this.props.)
  }

  async getTimes() {
    let rs = await apis.getTimeKeepingByTraderWithDate(
      {},
      "GET",
      this.props.currentDate.toDateString()
    );
    if (rs) {
      let list = [];
      this.props.employees.forEach((emp) => {
        let filter = rs.data.filter((e) => e.empId === emp.id);
        if (filter.length > 0) {
          let data = filter[0];
          data.checked = true;
          list.push(filter[0]);
        } else {
          list.push({
            empId: emp.id,
            empName: emp.name,
            id: 0,
            money: 1000000,
            note: 0,
            status: 1,
            workDay: this.props.currentDate,
            checked: false,
          });
        }
      });
      this.setState({
        currentTimes: list,
      });
    }
  }
  handleChange = (value, item, name) => {
    let currentTimes = this.state.currentTimes;
    let data = currentTimes.filter((time) => time.empId === item.empId);
    if (data.length > 0) {
      data[0][name] = value;
      this.setState({ currentTimes: currentTimes });
    }
  };
  load() {
    this.getTimes();
    this.props.getTimes();
  }
  async submit() {
    let data = this.state.currentTimes;
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      if (item.checked) {
        if (item.id !== 0) {
          await apis.updateTimeKeeping(item, "POST");
        } else {
          await apis.createTimeKeeping(item, "POST");
        }
      } else {
        if (item.id !== 0) {
          await apis.deleteTimeKeepingByTrader({}, "POST", item.id);
        }
      }
    }
    this.props.load();
    this.props.cancel();
  }

  render() {
    console.log(this.state);
    return (
      <Modal
        width="60%"
        title="Basic Modal"
        visible={this.props.visible}
        onCancel={this.props.cancel}
        onOk={this.submit}
      >
        <List>
          <List.Item>
            <Row key="header" className="w-100">
              <Col md="2" xs="12" className="d-flex justify-content-center">
                <b>Trạng thái</b>
              </Col>
              <Col md="3" xs="12">
                <b>Tên</b>
              </Col>
              <Col md="3" xs="12">
                <b>Công</b>
              </Col>
              <Col md="2" xs="12" className="d-flex justify-content-center">
                <b>Thanh toán</b>
              </Col>
              <Col md="2" xs="12">
                <b>Tiền công</b>
              </Col>
            </Row>
          </List.Item>
        </List>
        <List
          dataSource={this.state.currentTimes}
          renderItem={(item) => (
            <>
              <List.Item>
                <Row key={item.id} className="w-100">
                  <Col md="2" xs="12" className="d-flex justify-content-center">
                    <Checkbox
                      checked={item.checked}
                      onChange={(event) =>
                        this.handleChange(event.target.checked, item, "checked")
                      }
                    />
                  </Col>
                  <Col md="3" xs="12">
                    <Widgets.Custom
                      label={item.empName}
                      value={this.state.note}
                      component={""}
                    />
                  </Col>
                  <Col md="3" xs="12">
                    <Widgets.Custom
                      component={
                        <Radio.Group
                          disabled={!item.checked}
                          value={item.status}
                          onChange={(event) =>
                            this.handleChange(
                              event.target.value,
                              item,
                              "status"
                            )
                          }
                        >
                          <Radio value={0.5}>Nửa công</Radio>
                          <Radio value={1}>Một công</Radio>
                        </Radio.Group>
                      }
                    />
                  </Col>

                  <Col md="2" xs="12" className="d-flex justify-content-center">
                    <Widgets.Custom
                      component={
                        <Checkbox
                          disabled={!item.checked}
                          checked={item.note === 0}
                          onChange={(event) =>
                            this.handleChange(
                              event.target.checked ? 0 : 1,
                              item,
                              "note"
                            )
                          }
                        />
                      }
                    />
                  </Col>
                  <Col md="2" xs="12">
                    <Widgets.Text
                      // displayType="input"
                      isDisable={!item.checked}
                      value={item.money}
                      onChange={(e) => this.handleChange(e, item, "money")}
                    />
                  </Col>
                </Row>
              </List.Item>
            </>
          )}
        />
      </Modal>
      // <Collapse>
      //   {this.state.currentTimes.map((item) => (
      //     <Collapse.Panel
      //       header={
      //         <Typography.Text type="success">{`${item.empName} | ${item.status} công | số tiền cần phải trả ${item.money} vnd`}</Typography.Text>
      //       }
      //       key={item.id}
      //     >
      //       <TimeKeepingDetail
      //         employees={this.mapEmp()}
      //         data={item}
      //         load={this.getTimes}
      //       />
      //     </Collapse.Panel>
      //   ))}
      //   {this.checkExitsEmp() && (
      //     <Collapse.Panel header="Thêm lịch" key={`${this.props.currentDate}`}>
      //       <AddMore
      //         employees={this.mapEmp()}
      //         currentDate={this.props.currentDate}
      //         load={this.getTimes}
      //       />
      //     </Collapse.Panel>
      //   )}
      // </Collapse>
    );
  }
}