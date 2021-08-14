import React, { Component } from "react";
import { Table, Modal, Radio } from "antd";
import Widgets from "../../../../schema/Widgets";
import { helper, apis } from "../../../../services";

export default class CurrentEmps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTimes: [],
      employees: this.props.employees.filter((emp) => {
        let dateStart = new Date(emp.startDate);
        let dateEnd = emp.endDate ? new Date(emp.endDate) : null
        return this.props.currentDate > dateStart && (dateEnd === null || this.props.currentDate < dateEnd);
      }),
      submit: false,
    };
    this.getTimes = this.getTimes.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    this.getTimes();
  }
  componentDidUpdate(props) {
    if (this.props.currentDate !== props.currentDate) {
      this.setState({ submit: false });
      this.getTimes();
    }
  }

  async getTimes() {
    let rs = await apis.getTimeKeepingByTraderWithDate(
      {},
      "GET",
      this.props.currentDate.toDateString()
    );
    if (rs) {
      let list = [];
      let listCurrentEmps = this.props.employees.filter((emp) => {
        let startDate = new Date(emp.startDate);
        let endDate = null;
        if (emp.endDate) {
          endDate = new Date(emp.endDate);
        }
        // eslint-disable-next-line no-mixed-operators
        return (
          (this.props.currentDate > startDate && endDate === null) ||
          this.props.currentDate < endDate
        );
      });
      for (let i = 0; i < listCurrentEmps.length; i++) {
        let emp = listCurrentEmps[i];
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
            note: 0,
            status: 0,
            workDay: this.props.currentDate,
            checked: false,
          });
        }
      }
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
  handleChangeStatus = (value, item) => {
    let currentTimes = this.state.currentTimes;
    let data = currentTimes.filter((time) => time.empId === item.empId);
    if (data.length > 0) {
      if (value === 0) {
        data[0].status = value;
        data[0].checked = false;
        this.setState({ currentTimes: currentTimes });
      } else {
        data[0].status = value;
        data[0].checked = true;
        this.setState({ currentTimes: currentTimes });
      }
    }
  };
  load() {
    this.getTimes();
    this.props.getTimes();
  }
  async submit() {
    this.props.cancel();
    let data = this.state.currentTimes;
    if (!this.state.submit) {
      this.setState({ submit: true });
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        item.workDay = helper.correctDate(item.workDay);
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
    }
  }

  render() {
    let date = this.props.currentDate.getDate().toString();
    let month = this.props.currentDate.getMonth().toString();
    let year = this.props.currentDate.getFullYear();
    date = date.length === 1 ? `0${date}` : date;
    month = month.length === 1 ? `0${month}` : month;
    return (
      <Modal
        width="70%"
        // eslint-disable-next-line no-useless-escape
        title={`Chấm công trong ngày ${date}\/${month}\/${year}`}
        okText="Lưu"
        visible={this.props.visible}
        onCancel={this.props.cancel}
        onOk={this.submit}
      >
        <Table
          dataSource={this.state.currentTimes}
          columns={[
            {
              title: "Tên nhân viên",
              dataIndex: "empName",
              key: "empName",
            },
            {
              title: "Số công",
              key: "status",
              render: (item) => (
                <Widgets.Custom
                  component={
                    <Radio.Group
                      value={item.status}
                      onChange={(event) =>
                        this.handleChangeStatus(event.target.value, item)
                      }
                    >
                      <Radio value={0}>Không đi làm</Radio>
                      <Radio value={0.5}>Nửa công</Radio>
                      <Radio value={1}>Một công</Radio>
                    </Radio.Group>
                  }
                />
              ),
            },
          ]}
        />
      </Modal>
    );
  }
}
