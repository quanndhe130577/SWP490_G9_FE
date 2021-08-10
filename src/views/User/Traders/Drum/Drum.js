import React, { Component } from "react";
import { Table, Input, Space, Card, Dropdown, Menu } from "antd";
// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Row, Col, Button } from "reactstrap";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import ModalForm from "./ModalForm";
export default class Truck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      trucks: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchDrum();
    this.fetchTruck();
  }
  async fetchTruck() {
    try {
      this.setState({ loading: true });
      let user = await session.get("user");
      let rs = await apis.getTruck({}, "GET");
      if (rs && rs.statusCode === 200) {
        console.log(rs);
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ trucks: rs.data, user });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }
  async fetchDrum() {
    try {
      this.setState({ loading: true });
      let rs = await apis.getDrumByTraderId({}, "GET");
      if (rs && rs.statusCode === 200) {
        console.log(rs);
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ drums: rs.data, total: rs.data.length });
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

  renderTitle = () => {
    let { total } = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("drumManagement")}</h3>
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
  closeModal = (refresh) => {
    if (refresh) {
      this.fetchDrum();
    }
    this.setState({ isShowModal: false, mode: "", currentDrum: {} });
  };
  onClick(modeBtn, drumId) {
    let { currentDrum, drums } = this.state;

    if (modeBtn === "edit") {
      currentDrum = drums.find((el) => el.id === drumId);
      this.setState({ currentDrum, mode: "edit", isShowModal: true });
    } else if (modeBtn === "delete") {
      helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
        if (rs) {
          try {
            let rs = await apis.deleteDrum({}, "POST", drumId);
            if (rs && rs.statusCode === 200) {
              helper.toast("success", rs.message || i18n.t("success"));
              this.fetchDrum();
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
  findLabel(key) {
    return this.state.trucks.find((el) => el.id === parseInt(key)) || {};
  }
  render() {
    const { isShowModal, mode, drums, trucks, user, currentDrum, loading } =
      this.state;
    const columns = [
      {
        title: i18n.t("INDEX"),
        dataIndex: "idx",
        key: "idx",
        render: (text) => <label>{text}</label>,
      },
      {
        title: i18n.t("numberDrum"),
        dataIndex: "number",
        key: "number",
        ...this.getColumnSearchProps("number"),
        sorter: (a, b) => a.number.length - b.number.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: i18n.t("drumManagement.headerTable.typeDrum"),
        dataIndex: "type",
        key: "type",
        ...this.getColumnSearchProps("type"),
        //sorter: (a, b) => a.number.length - b.number.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: i18n.t("truck"),
        dataIndex: "truckId",
        key: "truckId",
        render: (truckId) => (
          <div>{truckId && <label>{this.findLabel(truckId).name}</label>}</div>
        ),
      },

      {
        title: "",
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
            trucks={trucks}
            user={user}
            currentDrum={currentDrum}
            // handleChangeTruck={handleChangeTruck}
          />
        )}
        <Row>
          <Col style={{ overflowX: "auto" }}>
            <Table
              bordered
              columns={columns}
              dataSource={drums}
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
