import React, { Component } from "react";
import { Table, Input, Space, Card, DatePicker, Menu } from "antd";
// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import Widgets from "../../../../../schema/Widgets";
import { Row, Col, Button } from "reactstrap";
import i18n from "i18next";
import apis from "../../../../../services/apis";
import helper from "../../../../../services/helper";
import session from "../../../../../services/session";
import ModalForm from "./ModalEMP";
import Moment from "react-moment";
import moment from "moment";

export default class EmployeeHistorySalary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      date:moment(),
      data: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchEmployee();
  }

  async fetchEmployee() {
    try {
      let user = await session.get("user");
      let rs = await apis.getEmployees({}, "GET");
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ data: rs.data, user, total: rs.data.length });
      }
    } catch (error) {
    } finally {
      this.setState({ loading: false });
    }
  }

  renderTitle = () => {
    let { total } = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("Employee History Salary Manager")}</h3>
          <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
        </Col>
        <Col md="6">
          <DatePicker className="pull-right" defaultValue={this.state.date} onChange={(date)=>this.setState({date:date})} picker="month" />
        </Col>
      </Row>
    );
  };


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
  onClick(modeBtn, employeeId) {
    let { currentEmp, data } = this.state;

    if (modeBtn === "edit") {
      currentEmp = data.find((el) => el.id === employeeId);
      this.setState({ currentEmp, mode: "edit", isShowModal: true });
    }
  }

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
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
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
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
    const { isShowModal, mode, currentEmp, data, loading } = this.state;
    const columns = [
      {
        title: i18n.t("INDEX"),
        dataIndex: "idx",
        key: "idx",
        render: (text) => <label>{text}</label>,
      },
      {
        title: i18n.t("name"),
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name"),
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: i18n.t("salary"),
        dataIndex: "salary",
        key: "salary",
        ...this.getColumnSearchProps("salary"),
        sorter: (a, b) => a.status - b.status,
        sortDirections: ["descend", "ascend"],
        render: data => data?<Widgets.NumberFormat neddFormGroup={false} displayType='text' value={data} />:"Chưa có dữ liệu"
      },
      {
        title: "",
        dataIndex: "id",
        key: "id",
        render: (id) => (
        <Button onClick={() => this.onClick("edit", id)}>
          <i className="fa fa-cog mr-1" />
          <label className="tb-lb-action">{i18n.t("edit")}</label>
        </Button>
        ),
      },
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
