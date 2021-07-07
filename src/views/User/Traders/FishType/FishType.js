// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Dropdown, Input, Menu, Space, Table } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { Button, Col, Row } from "reactstrap";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import ModalForm from "./ModalForm";
// import Moment from "react-moment";
export default class FishType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      data: [],
      loading: true
    };
  }

  componentDidMount() {
    this.fetchFishType();
  }

  async fetchFishType() {
    try {
      this.setState({ loading: true })
      let user = await session.get("user");
      let rs = await apis.getFTByTraderID({}, "GET");
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ data: rs.data, user, total: rs.data.length });
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      this.setState({ loading: false })
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

  renderTitle = () => {
    let { total } = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("fishTypeManagement")}</h3>
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

    if (refresh === true) {
      this.fetchFishType();
    }
    this.setState({ isShowModal: false, mode: "", currentFT: {} });
  };
  onClick(modeBtn, FishTypeID) {
    let { currentFT, data } = this.state;

    if (modeBtn === "edit") {
      currentFT = data.find((el) => el.id === FishTypeID);
      currentFT.date = new Date(currentFT.date)
      this.setState({ currentFT, mode: "edit", isShowModal: true });
    } else if (modeBtn === "delete") {
      helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
        if (rs) {
          try {
            let rs = await apis.deleteFT({}, "POST", FishTypeID);
            if (rs && rs.statusCode === 200) {
              helper.toast("success", rs.message || i18n.t("success"));
              this.fetchFishType();
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
        <Menu.Item>
          <Button
            color="info"
            className="mr-2"
            onClick={() => this.onClick("edit", id)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t("edit")}
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button color="danger" onClick={() => this.onClick("delete", id)}>
            <i className="fa fa-trash-o mr-1" />
            {i18n.t("delete")}
          </Button>
        </Menu.Item>
      </Menu>
    );
  }
  findFT(id) {
    let tem = this.state.data.find((el) => el.id === id);
    if (tem)
      return (
        <div>
          <span>{tem.minWeight} - {tem.maxWeight}</span>
        </div>
      );
  }
  render() {
    const { isShowModal, mode, currentFT, data, loading } = this.state;
    const columns = [
      {
        title: i18n.t("INDEX"),
        dataIndex: "idx",
        key: "idx",
        render: (text) => <label>{text}</label>,
      },
      {
        title: i18n.t("Tên loại cá"),
        dataIndex: "fishName",
        key: "fishName",
        ...this.getColumnSearchProps("fishName"),
        sorter: (a, b) => a.fishName.length - b.fishName.length,
        sortDirections: ["descend", "ascend"],
      },
      // {
      //   title: i18n.t("Mô tả"),
      //   dataIndex: "description",
      //   key: "description",
      //   ...this.getColumnSearchProps("description"),
      //   sorter: (a, b) => a.description - b.description,
      //   sortDirections: ["descend", "ascend"],
      // },

      // {
      //   title: i18n.t("Cân nặng tối thiểu"),
      //   dataIndex: "minWeight",
      //   key: "minWeight",
      //   ...this.getColumnSearchProps("minWeight"),
      //   sorter: (a, b) => a.minWeight - b.minWeight,
      //   sortDirections: ["descend", "ascend"],
      // },
      // {
      //   title: i18n.t("Cân nặng tối đa"),
      //   dataIndex: "maxWeight",
      //   key: "maxWeight",
      //   ...this.getColumnSearchProps("maxWeight"),
      //   sorter: (a, b) => a.maxWeight - b.maxWeight,
      //   sortDirections: ["descend", "ascend"],
      // },

      {
        title: i18n.t("Cân nặng (khoảng)"),
        colSpan: 1,
        dataIndex: "id",
        key: "id",
        render: (id) => this.findFT(id),
        // ...this.getColumnSearchProps("minWeight"),
        sorter: (a, b) => a.minWeight - b.minWeight,
        sortDirections: ["descend", "ascend"],
      },

      // {
      //   title: i18n.t("Ngày tạo"),
      //   dataIndex: "date",
      //   key: "date",
      //   ...this.getColumnSearchProps("date"),
      //   sorter: (a, b) => a.date.length - b.date.length,
      //   sortDirections: ["descend", "ascend"],
      //   render: (date) => (
      //     <Moment format="DD/MM/YYYY">
      //           {date}
      //       </Moment>
      //   ),
      // },
      {
        title: i18n.t("Giá"),
        dataIndex: "price",
        key: "price",
        ...this.getColumnSearchProps("price"),
        sorter: (a, b) => a.price - b.price,
        sortDirections: ["descend", "ascend"],
        render: (price) => (
          <NumberFormat
            value={price}
            displayType={"text"}
            thousandSeparator={true}
          />
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
      <Card title={this.renderTitle()}>
        {isShowModal && mode !== "" && (
          <ModalForm
            isShow={isShowModal}
            mode={mode}
            closeModal={this.closeModal}
            currentFT={currentFT || {}}
            loading={loading}
          // handleChangeFishType={handleChangeFishType}
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
