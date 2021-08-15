import "./Debt.css";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Space, Table, Tabs } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { Button, Col, Row } from "reactstrap";
import { apis, helper, session } from "../../../services";
import Moment from "react-moment";
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
        rs = await apis.getAllDebtPurchase({}, "GET");
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
        rs = await apis.getAllDebtPurchase({}, "GET");
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
  onClick = async (id) => {
    helper.confirm(i18n.t("comfirmUpdate")).then(async (rs) => {
      if (rs) {
        let rs;
        if (this.state.mode === "purchase") {
          console.log("purchase");
          rs = await apis.updateDebtPurchase({}, "GET", id);
        } else {
          rs = await apis.updateDebtTransaction({}, "GET", id);
        }
        console.log(rs);
        if (rs) {
          helper.toast("success", rs.message);
        }
        await this.fetchDebt();
      }
    });
  };

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
  // renderTabBar = (props, DefaultTabBar) => {
  //   console.log(props, DefaultTabBar)
  //   return (
  //     <div>
  //       <div>{props.panes.map(item => item)}</div>
  //       {({ style }) => (
  //         <DefaultTabBar {...props} className="site-custom-tab-bar" style={{ ...style }} />
  //       )}
  //     </div>
  //   )
  // };
  render() {
    const { data, loading } = this.state;
    const columns = [
      {
        title: i18n.t("INDEX"),
        dataIndex: "idx",
        key: "idx",
        width: 60,

        render: (text) => <label>{text}</label>,
      },
      {
        title:
          this.state.mode === "purchase"
            ? i18n.t("pondOwner")
            : i18n.t("buyer"),
        dataIndex: "partner",
        key: "partner",
        ...this.getColumnSearchProps("debtor"),
        sorter: (a, b) => a.debtor.length - b.debtor.length,
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
        ),
      },
    ];
    return (
      <Card title={this.renderTitle()} className="body-minH">
        <Row>
          <Col style={{ overflowX: "auto" }}>
            <div className="debt-container">
              {this.state.user.roleName === "Trader" ? (
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
                      columns={columns}
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
                      columns={columns}
                      dataSource={data}
                      pagination={{ pageSize: 10 }}
                      scroll={{ y: 600 }}
                      loading={loading}
                      rowKey="id"
                    />
                  </TabPane>
                </Tabs>
              ) : (
                <Table
                  bordered
                  columns={columns}
                  dataSource={data}
                  pagination={{ pageSize: 10 }}
                  scroll={{ y: 600 }}
                  loading={loading}
                  rowKey="id"
                />
              )}
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}
