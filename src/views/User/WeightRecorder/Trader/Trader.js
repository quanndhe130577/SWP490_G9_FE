import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Space, Table } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import { Button, Col, Row } from "reactstrap";
import { apis, helper } from "../../../../services";
import ModalForm from "./ModalTrader";
import Widgets from "../../../../schema/Widgets";
import { API_FETCH } from "../../../../constant";

export default class Trader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      data: [],
      loading: false,
      searchPhone: [],
    };
    this.fetchOptions = this.fetchOptions.bind(this);
    this.handleAddTrader = this.handleAddTrader.bind(this);
  }

  componentDidMount() {
    this.fetchTrader();
  }

  async fetchTrader() {
    try {
      let rs = await apis.getTraderByWR({}, "GET");
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

  renderTitle = () => {
    let { total } = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("Trader")}</h3>
          <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
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
      this.fetchTrader();
    }
    this.setState({ isShowModal: false, mode: "", currentTrader: {} });
  };
  onClick(modeBtn, TraderID) {
    let { currentTrader, data } = this.state;

    if (modeBtn === "edit") {
      currentTrader = data.find((el) => el.id === TraderID);
      this.setState({ currentTrader, mode: "edit", isShowModal: true });
    } else if (modeBtn === "delete") {
      helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
        if (rs) {
          try {
            let rs = await apis.deleteTrader({}, "POST", TraderID);

            if (rs && rs.statusCode === 200) {
              helper.toast("success", rs.message || i18n.t("success"));
              this.fetchTrader();
            }
          } catch (error) {
            console.log(error);
            helper.toast("error", i18n.t("systemError"));
          }
        }
      });
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
  columns = [
    {
      title: i18n.t("INDEX"),
      dataIndex: "idx",
      key: "idx",
      render: (text) => <label>{text}</label>,
    },
    {
      title: i18n.t("name"),
      dataIndex: "firstName",
      key: "firstName",

      render: (firstName, record) => (
        <label>{firstName + " " + record.lastName}</label>
      ),
    },
    {
      title: i18n.t("address"),
      dataIndex: "address",
      key: "address",
      ...this.getColumnSearchProps("address"),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: i18n.t("phoneNumber"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...this.getColumnSearchProps("phoneNumber"),
      sorter: (a, b) =>
        (a?.phoneNumber ?? "").localeCompare(b?.phoneNumber ?? "", "vi", {
          sensitivity: "base",
        }),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Button color="danger" onClick={() => this.onClick("delete", id)}>
          <i className="fa fa-trash-o mr-1" />
          {i18n.t("delete")}
        </Button>
      ),
    },
  ];
  fetchOptions = async (phone) => {
    return await apis.suggestTDByPhone({}, "GET", phone);
  };
  handleChangeSearchPhone = async (searchPhone) => {
    try {
      this.setState({ searchPhone: [searchPhone] });
    } catch (error) {
      console.log(error);
    }
  };

  async handleAddTrader() {
    try {
      if (this.state.searchPhone) {
        let rs = await apis.wrAddTrader({
          traderId: parseInt(this.state.searchPhone[0].value),
        });
        if (rs && rs.statusCode === 200) {
          helper.toast("success", rs.message || i18n.t("success"));
          this.fetchTrader();
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { isShowModal, mode, currentTrader, data, loading, searchPhone } =
      this.state;

    return (
      <Card title={this.renderTitle()}>
        {isShowModal && mode !== "" && (
          <ModalForm
            isShow={isShowModal}
            mode={mode}
            closeModal={this.closeModal}
            currentTrader={currentTrader || {}}
          // handleChangePondOwner={handleChangePondOwner}
          />
        )}
        <Row>
          <Col md="6">
            <Widgets.SearchFetchApi
              label={i18n.t("findTrader")}
              fetchOptions={this.fetchOptions}
              onSelect={this.handleChangeSearchPhone}
              value={searchPhone || ""}
              placeholder={i18n.t("enterPhoneToFind")}
              api={API_FETCH.FIND_TRADER}
              displayField={["firstName", "lastName", "phoneNumber"]}
              saveField="id"
            />
          </Col>
          <Col md="6">
            <Button
              color="info"
              className="mt-4"
              onClick={this.handleAddTrader}
            >
              <i className="fa fa-plus mr-1" />
              {i18n.t("addTrader")}
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
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
