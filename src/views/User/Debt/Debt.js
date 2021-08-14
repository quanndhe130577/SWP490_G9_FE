import { SearchOutlined } from "@ant-design/icons";
import { Card, Dropdown, Input, Menu, Space, Table } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { Button, Col, Row } from "reactstrap";
import { apis, helper, session } from "../../../services";
import ModalForm from "./ModalDebt";
import Moment from "react-moment";

export default class Debt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      data: [],
      loading: true,
    };
    this.testHanldeEdit = this.testHanldeEdit.bind(this);
  }

  componentDidMount() {
    //this.setState({loading:false})
    this.fetchDebt();
  }
  testHanldeEdit(editedDebt) {
    let temArr = this.state.data;
    // replace debt at position idx by edited debt
    temArr[parseInt(editedDebt.idx)] = editedDebt;
    this.setState({ data: temArr });
  }
  async fetchDebt() {
    try {
      this.setState({ loading: true });
      let user = await session.get("user");
      let rs = await apis.getAllDebt({}, "GET");
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ data: rs.data, user, total: rs.data.length });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
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
          placeholder={`${i18n.t("Search")} ${i18n.t(dataIndex)}`}
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
      this.state.searchedColumn === dataIndex ? <div>{text}</div> : text,
  });

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
      this.fetchDebt();
    }
    this.setState({ isShowModal: false, mode: "", currentDebt: {} });
  };
  onClick(modeBtn, DebtID) {
    let { currentDebt, data } = this.state;

    if (modeBtn === "edit") {
      currentDebt = data.find((el) => el.id === DebtID);
      currentDebt.createdDate = new Date(currentDebt.createdDate);
      currentDebt.deadline = new Date(currentDebt.deadline);
      this.setState({ currentDebt, mode: "edit", isShowModal: true });
    } else if (modeBtn === "delete") {
      helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
        if (rs) {
          try {
            let rs = await apis.deleteDebt({}, "POST", DebtID);
            if (rs && rs.statusCode === 200) {
              helper.toast("success", rs.message || i18n.t("success"));
              this.fetchDebt();
            }
          } catch (error) {
            console.log(error);
            helper.toast("error", i18n.t("systemError"));
          }
        }
      });
    }
  }

  renderBtnAction(id) {
    return (
      <Menu>
        <Menu.Item key="1">
          <Button
            color="info"
            className="mr-2"
            onClick={() => this.onClick("edit", id)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t("edit")}
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button color="danger" onClick={() => this.onClick("delete", id)}>
            <i className="fa fa-trash-o mr-1" />
            {i18n.t("delete")}
          </Button>
        </Menu.Item>
      </Menu>
    );
  }

  renderTitle = () => {
    let { total } = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("Debt Management")}</h3>
          <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
        </Col>

        <Col md="6">
          <Button
            color="info"
            className="pull-right"
            onClick={() => {
              this.setState({ isShowModal: true, mode: "create" });
            }}
          >
            <i className="fa fa-plus mr-1" />
            {i18n.t("create")}
          </Button>
        </Col>
      </Row>
    );
  };
  render() {
    const { isShowModal, mode, currentDebt, data, loading } = this.state;
    const columns = [
      {
        title: i18n.t("INDEX"),
        dataIndex: "idx",
        key: "idx",
        width: 60,

        render: (text) => <label>{text}</label>,
      },
      {
        title: i18n.t("Debtor"),
        dataIndex: "debtor",
        key: "debtor",
        ...this.getColumnSearchProps("debtor"),
        sorter: (a, b) => a.debtor.length - b.debtor.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: i18n.t("Creditor"),
        dataIndex: "creditors",
        key: "creditors",
        ...this.getColumnSearchProps("creditors"),
        sorter: (a, b) => a.creditors.length - b.creditors.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: i18n.t("Debt Money") + i18n.t("(suffix)"),
        dataIndex: "debtMoney",
        key: "debtMoney",
        ...this.getColumnSearchProps("debtMoney"),
        sorter: (a, b) => a.debtMoney - b.debtMoney,
        sortDirections: ["descend", "ascend"],
        render: (debtMoney) => (
          <NumberFormat
            value={debtMoney}
            displayType={"text"}
            thousandSeparator={true}
          />
        ),
      },
      {
        title: i18n.t("Date"),
        dataIndex: "date",
        key: "date",
        ...this.getColumnSearchProps("date"),
        sorter: (a, b) => a.date.length - b.date.length,
        sortDirections: ["descend", "ascend"],
        render: (date) => <Moment format="DD/MM/YYYY">{date}</Moment>,
      },
      {
        title: i18n.t("action"),
        dataIndex: "id",
        key: "id",
        render: (id) => (
          <Dropdown overlay={this.renderBtnAction(id)}>
            <Button>
              <i className="fa fa-cog mr-1" />
              <label className="tb-lb-action">{i18n.t("action")}</label>
            </Button>
          </Dropdown>
        ),
      },
    ];
    return (
      <Card title={this.renderTitle()} className="body-minH">
        {isShowModal && mode !== "" && (
          <ModalForm
            isShow={isShowModal}
            mode={mode}
            closeModal={this.closeModal}
            currentDebt={currentDebt || {}}
            loading={loading}
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
              rowKey="id"
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
