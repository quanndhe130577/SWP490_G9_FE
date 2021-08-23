import "./Debt.css";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Space, Table, Tabs, Menu, Dropdown } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { Button, Col, Row } from "reactstrap";
import { apis, helper, session } from "../../../services";
import Moment from "react-moment";
import moment from "moment";
import ModalDebt from "./ModalDebt";

const { TabPane } = Tabs;

export default class Debt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "transaction",
      data: [],
      columns: [],
      loading: true,
      user: session.get("user"),
      currentDebt: {},
    };
  }
  componentDidMount() {
    this.fetchDebt();
  }
  async fetchDebt() {
    try {
      this.setState({ loading: true });
      let rs;
      if (this.state.mode === "purchase") {
        if (this.state.user.roleName === "Trader") {
          rs = await apis.getAllDebtPurchase({}, "GET");
        } else {
          rs = await apis.debtWithTrader({}, "GET");
        }
      } else {
        rs = await apis.getAllDebtTransaction({}, "GET");
      }
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ data: rs.data, total: rs.data.length });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }
  async fetchDebtByMode(mode) {
    try {
      this.setState({ loading: true });
      let rs;
      if (mode === "purchase") {
        if (this.state.user.roleName === "Trader") {
          rs = await apis.getAllDebtPurchase({}, "GET");
        } else {
          rs = await apis.debtWithTrader({}, "GET");
        }
      } else {
        rs = await apis.getAllDebtTransaction({}, "GET");
      }
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ data: rs.data, total: rs.data.length });
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
            {i18n.t("Search")}
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {i18n.t("Reset")}
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

  onClick = async (id, amount = 0) => {
    helper.confirm(i18n.t("comfirmPaidDebt") + "?").then(async (rs) => {
      if (rs) {
        let rs;
        if (this.state.mode === "purchase") {
          rs = await apis.updateDebtPurchase({}, "GET", id + "/" + amount);
        } else {
          rs = await apis.updateDebtTransaction({}, "GET", id);
        }
        console.log(rs);
        if (rs) {
          helper.toast("success", rs.message);
        }
        await this.fetchDebt();

        this.setState({ isShowModal: false });
      }
    });
  };
  renderBtnAction(id, cell) {
    return (
      <Menu>
        <Menu.Item key="1">
          <Button
            color="info"
            className="mr-2 w-100"
            onClick={() => this.onClick(id, cell.amount)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {this.state.mode === "purchase"
              ? i18n.t("PurchaseIsPaid")
              : i18n.t("TransactionIsPaid")}
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button
            color="danger"
            className="mr-2 w-100"
            onClick={() => {
              this.setState({
                isShowModal: true,
                currentDebt: cell,
              });
            }}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {"Trả một phần"}
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
      </Row>
    );
  };
  setMode = (state) => {
    this.setState({ mode: state });
    this.fetchDebtByMode(state);
  };
  getColum() {
    return this.state.mode === "purchase"
      ? [
          {
            title: i18n.t("INDEX"),
            dataIndex: "idx",
            key: "idx",
            width: 60,

            render: (text) => <label>{text}</label>,
          },
          {
            title: i18n.t("time"),
            dataIndex: "date",
            key: "date",
            ...this.getColumnSearchProps("date"),
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
            sortDirections: ["descend", "ascend"],
            render: (date) => <Moment format="DD/MM/YYYY">{date}</Moment>,
          },
          {
            title: i18n.t(
              this.state.user.roleName === "Trader" ? "pondOwner" : "trader"
            ),
            dataIndex: "partner",
            key: "partner",
            ...this.getColumnSearchProps("debtor"),
            sorter: (a, b) => a.partner.length - b.partner.length,
            sortDirections: ["descend", "ascend"],
          },
          {
            title: i18n.t("Debt Money") + i18n.t("(suffix)"),
            dataIndex: "amount",
            key: "amount",
            ...this.getColumnSearchProps("amount"),
            sorter: (a, b) => a.amount - b.amount,
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
            title: i18n.t("action"),
            dataIndex: "id",
            key: "id",
            render: (id, cell) => (
              <Dropdown overlay={this.renderBtnAction(id, cell)}>
                <Button>
                  <i className="fa fa-cog mr-1" />
                  <label className="tb-lb-action">{i18n.t("action")}</label>
                </Button>
              </Dropdown>
            ),
          },
        ]
      : [
          {
            title: i18n.t("INDEX"),
            dataIndex: "idx",
            key: "idx",
            width: 60,

            render: (text) => <label>{text}</label>,
          },
          {
            title: i18n.t("time"),
            dataIndex: "date",
            key: "date",
            ...this.getColumnSearchProps("date"),
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
            sortDirections: ["descend", "ascend"],
            render: (date) => <Moment format="DD/MM/YYYY">{date}</Moment>,
          },
          {
            title: i18n.t("buyer"),
            dataIndex: "partner",
            key: "partner",
            ...this.getColumnSearchProps("debtor"),
            sorter: (a, b) => a.partner.length - b.partner.length,
            sortDirections: ["descend", "ascend"],
          },
          {
            title: i18n.t("fishName"),
            dataIndex: "fishName",
            key: "fishName",
            ...this.getColumnSearchProps("fishName"),
            sorter: (a, b) => a.fishName.length - b.fishName.length,
            sortDirections: ["descend", "ascend"],
          },
          {
            title: i18n.t("weight"),
            dataIndex: "weight",
            key: "weight",
            ...this.getColumnSearchProps("weight"),
            sorter: (a, b) => a.weight - b.weight,
            sortDirections: ["descend", "ascend"],
          },
          {
            title: i18n.t("Debt Money") + i18n.t("(suffix)"),
            dataIndex: "amount",
            key: "amount",
            ...this.getColumnSearchProps("amount"),
            sorter: (a, b) => a.amount - b.amount,
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
            title: i18n.t("action"),
            dataIndex: "id",
            key: "id",
            render: (id, cell) => (
              <div>
                <Button
                  color="info"
                  className="mr-2"
                  onClick={() => this.onClick(id)}
                >
                  <i className="fa fa-pencil-square-o mr-1" />
                  {this.state.mode === "purchase"
                    ? i18n.t("PurchaseIsPaid")
                    : i18n.t("TransactionIsPaid")}
                </Button>
              </div>
            ),
          },
        ];
  }
  render() {
    const { data, loading } = this.state;
    return (
      <Card title={this.renderTitle()} className="body-minH">
        <ModalDebt
          isShow={this.state.isShowModal}
          closeModal={() => {
            this.setState({ isShowModal: false });
            this.fetchDebt();
          }}
          currentDebt={this.state.currentDebt}
          updateDebt={this.onClick}
        />
        <Row>
          <Col style={{ overflowX: "auto" }}>
            <div className="debt-container">
              {/* {this.state.user.roleName === "Trader" ? ( */}
              <Tabs
                defaultActiveKey={this.state.mode}
                onChange={this.setMode}
                centered
              >
                <TabPane
                  tab={i18n.t("Transaction Debt")}
                  key="transaction"
                  size="large"
                >
                  <Table
                    bordered
                    columns={this.getColum()}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: 600 }}
                    loading={loading}
                    rowKey="id"
                  />
                </TabPane>
                <TabPane tab={i18n.t("Purchase Debt")} key="purchase">
                  <Table
                    bordered
                    columns={this.getColum()}
                    dataSource={data}
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: 600 }}
                    loading={loading}
                    rowKey="id"
                  />
                </TabPane>
              </Tabs>
              {/* ) : ( */}
              {/* <Table
                  bordered
                  columns={this.getColum()}
                  dataSource={data}
                  pagination={{ pageSize: 10 }}
                  scroll={{ y: 600 }}
                  loading={loading}
                  rowKey="id"
                /> */}
              {/* )} */}
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}
