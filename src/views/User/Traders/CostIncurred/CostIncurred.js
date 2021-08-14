import { SearchOutlined } from "@ant-design/icons";
import { Card, DatePicker, Dropdown, Input, Menu, Space, Table } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import { Button, Col, Row } from "reactstrap";
import { apis, helper, session } from "../../../../services";
import ModalForm from "./ModalCostIncurred";
import moment from "moment";
export default class CostIncurred extends Component {
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
  }

  componentDidMount() {
    this.fetchCostIncurred();
  }

  async fetchCostIncurred() {
    try {
      let user = await session.get("user");

      let rs = await apis.getCostIncurred({}, "GET");

      // let rs = await apis.getPondOwnerByTraderId({}, "GET", user.userID);
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

  renderTitle = () => {
    let { total } = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("CostIncurredManagement")}</h3>
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
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
    confirm();
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  closeModal = (refresh) => {
    if (refresh === true) {
      this.fetchCostIncurred();
    }
    this.setState({
      isShowModal: false,
      mode: "",
      currentCostInc: {},
    });
  };
  async onClick(modeBtn, costIncID) {
    let { currentCostInc } = this.state;

    if (modeBtn === "edit") {
      //currentCostInc = data.find((el) => el.id === costIncID);
      let rs = await apis.getDetailCostIncurred({}, "GET", costIncID);
      if (rs && rs.statusCode === 200) {
        currentCostInc = rs.data;
      }
      this.setState({ currentCostInc, mode: "edit", isShowModal: true });
    } else if (modeBtn === "delete") {
      helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
        if (rs) {
          try {
            let rs = await apis.deleteCostIncurred({}, "POST", costIncID);

            if (rs && rs.statusCode === 200) {
              helper.toast("success", rs.message || i18n.t("success"));
              this.fetchCostIncurred();
            }
          } catch (error) {
            console.log(error);
            helper.toast("error", i18n.t("systemError"));
          }
        }
      });
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
        {isDate ? (
          <DatePicker
            value={selectedKeys[0]}
            onChange={(e) => {
              let t = moment(e, "DD/MM/YYYY");
              setSelectedKeys(e ? [t] : []);
              this.handleSearch(selectedKeys, confirm, dataIndex);
            }}
            onPressEnter={() => {
              this.handleSearch(selectedKeys, confirm, dataIndex);
            }}
            format={"DD/MM/YYYY"}
            style={{ marginBottom: 8, display: "block" }}
          />
        ) : (
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`${i18n.t("Search")} ${i18n.t(dataIndex)}`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
        )}
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (isDate) {
        let x = moment(moment(value).format("DD/MM/YYYY"), "DD/MM/YYYY");
        let y = moment(
          moment(record[dataIndex]).format("DD/MM/YYYY"),
          "DD/MM/YYYY"
        );

        return record[dataIndex] ? x.isSame(y, "day") : "";
      } else {
        return record[dataIndex]
          ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
          : "";
      }
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        // setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        //   <Highlighter
        //     highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        //     searchWords={[this.state.searchText]}
        //     autoEscape
        //     textToHighlight={text ? text.toString() : ""}
        //   />
        <div>{text}</div>
      ) : (
        text
      ),
  });
  columns = [
    {
      title: i18n.t("INDEX"),
      dataIndex: "idx",
      key: "idx",
      width: 60,
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
      title: i18n.t("typeOfCost"),
      dataIndex: "typeOfCost",
      key: "typeOfCost",
      ...this.getColumnSearchProps("typeOfCost"),
      sorter: (a, b) =>
        a.typeOfCost
          ? a.typeOfCost.length
          : 0 - b.typeOfCost
            ? b.typeOfCost.length
            : 0,
      sortDirections: ["descend", "ascend"],
      render: (text) => <label>{i18n.t(text)}</label>,
    },
    {
      title: i18n.t("note"),
      dataIndex: "note",
      key: "note",
      ...this.getColumnSearchProps("note"),
      sorter: (a, b) =>
        a.note ? a.note.length : 0 - b.note ? b.note.length : 0,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: i18n.t("cost") + i18n.t("(suffix)"),
      dataIndex: "cost",
      key: "cost",
      ...this.getColumnSearchProps("cost"),
      sorter: (a, b) => a.cost - b.cost,
      sortDirections: ["descend", "ascend"],
      render: (cost) => (
        <NumberFormat
          value={cost}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
    {
      title: i18n.t("date"),
      dataIndex: "date",
      key: "date",
      ...this.getColumnSearchProps("date", true),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
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
  render() {
    const { isShowModal, mode, currentCostInc, data, loading } = this.state;

    return (
      <Card title={this.renderTitle()} className="body-minH">
        {isShowModal && mode !== "" && (
          <ModalForm
            isShow={isShowModal}
            mode={mode}
            closeModal={this.closeModal}
            currentCostInc={currentCostInc || {}}
          // handleChangePondOwner={handleChangePondOwner}
          />
        )}
        <Row>
          <Col style={{ overflowX: "auto" }}>
            <Table
              bordered
              columns={this.columns}
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
