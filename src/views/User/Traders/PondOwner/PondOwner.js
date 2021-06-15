import React, { Component } from "react";
import { Table, Input, Space, Card } from "antd";
// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Row, Col, Button } from "reactstrap";
import i18n from "i18next";
import apis from "../../../../services/apis";
import session from "../../../../services/session";
import ModalForm from "./ModalForm";

// const data = [];
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   });
// }
export default class PondOwner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      data: [],
    };
  }

  componentDidMount() {
    this.fetchPondOwner();
  }

  async fetchPondOwner() {
    try {
      let user = await session.get("user");
      let rs = await apis.getPondOwnerByTraderId({}, "GET", user.userID);
      if (rs && rs.statusCode === 200) {
        this.setState({ data: rs.data });
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
        <div>hl</div>
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
    return (
      <Row>
        <Col md="6">
          <h3 className="mr-5">{i18n.t("pondOwnerManagement")}</h3>
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
      this.fetchPondOwner();
    }
    this.setState({ isShowModal: false, mode: "" });
  };
  onClick(modeBtn, pondOwnerID) {
    let { currentPO, data } = this.state;

    if (modeBtn === "edit") {
      currentPO = data.find((el) => el.id === pondOwnerID);
      this.setState({ currentPO, mode: "edit", isShowModal: true });
    }
  }
  render() {
    const { isShowModal, mode, currentPO, data } = this.state;
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "30%",
        ...this.getColumnSearchProps("name"),
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        width: "20%",
        ...this.getColumnSearchProps("address"),
        sorter: (a, b) => a.address - b.address,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Phone",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        ...this.getColumnSearchProps("phoneNumber"),
        sorter: (a, b) => a.phone.length - b.phone.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Action",
        dataIndex: "id",
        key: "id",
        render: (id) => (
          <div>
            <Button className="mr-2" onClick={() => this.onClick("edit", id)}>
              update
            </Button>
            <Button onClick={() => this.onClick("delete", id)}>Delete</Button>
          </div>
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
            // handleChangePondOwner={handleChangePondOwner}
          />
        )}
        <Table
          bordered
          columns={columns}
          dataSource={data}
          //   pagination={{ pageSize: 5 }}
          scroll={{ y: 450 }}
        />
      </Card>
    );
  }
}

// export default PondOwner;
