import React, { Component } from "react";
import { Table, Input, Space, Card, Dropdown, Menu } from "antd";
// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Row, Col, Button } from "reactstrap";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import ModalForm from "./ModalTruck";
export default class Truck extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      data: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.fetchTruck();
  }

  async fetchTruck() {
    try {
      this.setState({ isLoading: true });
      let user = await session.get("user");
      let rs = await apis.getTruck({}, "GET");
      if (rs && rs.statusCode === 200) {
        console.log(rs);
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({
          data: rs.data,
          user,
          total: rs.data.length,
          isLoading: false,
        });
      }
    } catch (error) {}
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
          <h3 className="">{i18n.t("truckManagement")}</h3>
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
      this.fetchTruck();
    }
    this.setState({ isShowModal: false, mode: "", currentPO: {} });
  };
  onClick(modeBtn, truckID) {
    let { currentPO, data } = this.state;

    if (modeBtn === "edit") {
      currentPO = data.find((el) => el.id === truckID);
      this.setState({ currentPO, mode: "edit", isShowModal: true });
    } else if (modeBtn === "delete") {
      helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
        if (rs) {
          try {
            let rs = await apis.deleteTruck({}, "POST", truckID);
            if (rs && rs.statusCode === 200) {
              helper.toast("success", rs.message || i18n.t("success"));
              this.fetchTruck();
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
  render() {
    const { isShowModal, mode, currentPO, data, isLoading } = this.state;
    const columns = [
      {
        title: i18n.t("INDEX"),
        dataIndex: "idx",
        key: "idx",
        render: (text) => <label>{text}</label>,
      },
      {
        title: i18n.t("licensePlate"),
        dataIndex: "licensePlate",
        key: "licensePlate",
        ...this.getColumnSearchProps("licensePlate"),
        sorter: (a, b) => a.licensePlate.length - b.licensePlate.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: i18n.t("name"),
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name"),
        sorter: (a, b) => a.licensePlate.length - b.licensePlate.length,
        sortDirections: ["descend", "ascend"],
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
      <Card title={this.renderTitle()}>
        {isShowModal && mode !== "" && (
          <ModalForm
            isShow={isShowModal}
            mode={mode}
            closeModal={this.closeModal}
            currentPO={currentPO || {}}
            // handleChangeTruck={handleChangeTruck}
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
              loading={isLoading}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
