import React, { Component } from "react";
import { Table, Input, Space, Card, Dropdown, Menu, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Row, Col, Button } from "reactstrap";
import i18n from "i18next";
import apis from "../../../../services/apis";
import session from "../../../../services/session";
import ModalBaseSalaries from "./ModalBaseSalaries";
import ModalHistorySalaries from "./ModalHistorySalaries";
import ModalEdit from "./ModalEdit";
import ModalAdvanceSalaries from "./ModalAdvanceSalaries";
import ModalCalculateSalaries from "./ModalCalculateSalaries";
import moment from "moment";
import Widgets from "../../../../schema/Widgets";

export default class EmployeeSalary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: moment(),
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      data: [],
      baseSalaries: [],
      advanceSalaries: [],
      historySalaries: [],
      loading: true,
      employeeId: 0,
      employeeName: "",
      canCalculate: false
    };
  }

  componentDidMount() {
    this.fetchEmployee();
  }

  fetchEmployee = async () => {
    try {
      let user = await session.get("user");
      let rs = await apis.getSalaryDetailEmployee({}, "GET", this.state.date._d.toDateString());
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ data: rs.data, user, total: rs.data.length, canCalculate: rs.data.filter(item => item.baseSalary !== null).length > 0 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }

  getBaseSalaries = async (id) => {
    let rs = await apis.getBaseSalariesByEmployeeId({}, "GET", id);
    if (rs) {
      this.setState({ baseSalaries: rs.data })
    }
  }

  getAdvanceSalaries = async (id) => {
    let rs = await apis.getAllAdvanceSalary({}, "GET", id);
    if (rs) {
      this.setState({ advanceSalaries: rs.data })
    }
  }
  getHistorySalaries = async (id) => {
    let rs = await apis.getAllEmpHistorySalary({}, "GET", id);
    if (rs) {
      this.setState({ historySalaries: rs.data })
    }
  }
  renderTitle = () => {
    let { total } = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("Employee Salary Mangerment")}</h3>
          <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
        </Col>

        <Col md="6">
          <div className='d-flex flex-row-reverse'>
            {
              this.state.canCalculate && <Button
                color="info"
                className="pull-right"
                onClick={() => {
                  this.setState({ isShowModal: true, mode: "calculate" });
                }}
              >
                {i18n.t("Calculate Salary")}
              </Button>
            }
            <DatePicker disabledDate={(date) => date.isAfter(moment())}
              picker="month"
              className='mr-2'
              onChange={value => {
                this.setState({ date: value })
                this.fetchEmployee()
              }} />
          </div>
        </Col>
      </Row>
    );
  };

  renderBtnAction(id, name) {
    return (
      <Menu>
        <Menu.Item key="1">
          <Button
            color="info"
            className="mr-2"
            onClick={() => this.onClick("edit", id, name)}
          >
            {i18n.t("Edit Salary")}
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button color="success" onClick={() => this.onClick("advance", id, name)}>
            {i18n.t("Advance Salary")}
          </Button>
        </Menu.Item>
        <Menu.Item key="3">
          <Button color="danger" onClick={() => this.onClick("history", id, name)}>
            {i18n.t("History Salary")}
          </Button>
        </Menu.Item>
        <Menu.Item key="4">
          <Button onClick={() => this.onClick("fluctuations", id, name)}>
            {i18n.t("Employee Base Salary Fluctuations")}
          </Button>
        </Menu.Item>
      </Menu>
    );
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  closeModal = (refresh) => {
    if (refresh === true) {
      this.fetchEmployee();
    }
    this.setState({ isShowModal: false, mode: "", currentEmp: {} });
  };
  async onClick(modeBtn, employeeId, employeeName) {
    let { currentEmp, data } = this.state;

    if (modeBtn === "edit") {
      currentEmp = data.find((el) => el.id === employeeId);
      this.setState({ currentEmp, mode: "edit", isShowModal: true, employeeName: employeeName });
    } else if (modeBtn === "fluctuations") {
      this.getBaseSalaries(employeeId);
      this.setState({ mode: "fluctuations", isShowModal: true, employeeName: employeeName });
    } else if (modeBtn === "advance") {
      this.getAdvanceSalaries(employeeId);
      this.setState({ mode: "advance", isShowModal: true, employeeId: employeeId, employeeName: employeeName });
    } else if (modeBtn === "history") {
      this.getHistorySalaries(employeeId);
      this.setState({ mode: "history", isShowModal: true, employeeId: employeeId, employeeName: employeeName });
    }
  }

  getColumnSearchProps = (dataIndex, isDate = false) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        {isDate ?
          <DatePicker
            value={selectedKeys[0]}
            onChange={(e) => {
              let t = moment(e, 'DD/MM/YYYY');
              setSelectedKeys(e ? [t] : [])
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }}
            onPressEnter={() => {
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            }
            format={'DD/MM/YYYY'}
            style={{ marginBottom: 8, display: "block" }}
          /> :
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
        }
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (isDate) {
        let x = moment(moment(value).format('DD/MM/YYYY'), 'DD/MM/YYYY')
        let y = moment(moment(record[dataIndex]).format('DD/MM/YYYY'), 'DD/MM/YYYY')

        return record[dataIndex]
          ? x.isSame(y, 'day')
          : ""
      } else {
        return record[dataIndex]
          ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
          : ""
      }
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <div>{text}</div>
      ) : (
        text
      ),
  });
  render() {
    let month = moment(this.state.date).endOf('month').format('D');
    const { isShowModal, mode, currentEmp, data, loading } = this.state;
    const columns = [
      {
        title: i18n.t("name"),
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name"),
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: i18n.t("status-tk"),
        dataIndex: "status",
        key: "status",
        ...this.getColumnSearchProps("status"),
        sorter: (a, b) =>
          (a?.phoneNumber ?? "").localeCompare(b?.phoneNumber ?? "", "vi", {
            sensitivity: "base",
          }),
        sortDirections: ["descend", "ascend"],
        render: (data) => `${data}\\${month}`
      },
      {
        title: i18n.t("Base Salary") + "(VND)",
        dataIndex: "baseSalary",
        key: "baseSalary",
        ...this.getColumnSearchProps("baseSalary"),
        sorter: (a, b) => a.baseSalary - b.baseSalary,
        sortDirections: ["descend", "ascend"],
        render: (salary) => salary !== null ? <Widgets.NumberFormat value={salary} needSuffix={false} /> : "Không có thông tin",
      },
      {
        title: i18n.t("Advance Salary") + "(VND)",
        dataIndex: "advanceSalary",
        key: "advanceSalary",
        ...this.getColumnSearchProps("advanceSalary"),
        sorter: (a, b) => a.baseSalary - b.baseSalary,
        sortDirections: ["descend", "ascend"],
        render: (salary) => salary !== null ? <Widgets.NumberFormat value={salary} needSuffix={false} /> : "Không có thông tin",
      },
      {
        title: i18n.t("bonus") + "(VND)",
        dataIndex: "bonus",
        key: "bonus",
        ...this.getColumnSearchProps("bonus", true),
        sorter: (a, b) => a > b,
        sortDirections: ["descend", "ascend"],
        render: (salary) => salary !== null ? <Widgets.NumberFormat value={salary} needSuffix={false} /> : "Không có thông tin",
      },
      {
        title: i18n.t("punish") + "(VND)",
        dataIndex: "punish",
        key: "punish",
        ...this.getColumnSearchProps("punish", true),
        sorter: (a, b) => a > b,
        sortDirections: ["descend", "ascend"],
        render: (salary) => salary !== null ? <Widgets.NumberFormat value={salary} needSuffix={false} /> : "Không có thông tin",
      },
      {
        title: i18n.t("salary-tk") + "(VND)",
        dataIndex: "salary",
        key: "salary",
        ...this.getColumnSearchProps("salary", true),
        sorter: (a, b) => a > b,
        sortDirections: ["descend", "ascend"],
        render: (salary) => salary !== null ? <Widgets.NumberFormat value={salary} needSuffix={false} /> : "Không có thông tin",
      },
      {
        title: i18n.t("action"),
        render: (data) => (
          <Dropdown overlay={this.renderBtnAction(data.id, data.name)}>
            <Button>
              <i className="fa fa-cog mr-1" />
            </Button>
          </Dropdown>
        ),
      },
    ];
    return (
      <Card title={this.renderTitle()}>
        {isShowModal && mode !== "" && (
          this.state.mode === "edit" ?
            <ModalEdit
              name={this.state.employeeName}
              isShow={isShowModal}
              mode={mode}
              closeModal={this.closeModal}
              currentEmp={currentEmp || {}}
            /> : this.state.mode === "fluctuations" ?
              <ModalBaseSalaries
                name={this.state.employeeName}
                isShow={isShowModal}
                closeModal={this.closeModal}
                baseSalaries={this.state.baseSalaries}
              /> : this.state.mode === "calculate" ?
                <ModalCalculateSalaries
                  name={this.state.employeeName}
                  isShow={isShowModal}
                  closeModal={this.closeModal}
                  date={this.state.date}
                /> : this.state.mode === "advance" ?
                  <ModalAdvanceSalaries
                    name={this.state.employeeName}
                    isShow={isShowModal}
                    closeModal={this.closeModal}
                    employeeId={this.state.employeeId}
                  /> : this.state.mode === "history" ?
                    <ModalHistorySalaries
                      name={this.state.employeeName}
                      isShow={isShowModal}
                      closeModal={this.closeModal}
                      historySalaries={this.state.historySalaries}
                    /> : ""
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
