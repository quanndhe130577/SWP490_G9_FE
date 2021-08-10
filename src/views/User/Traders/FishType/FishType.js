import { SearchOutlined } from "@ant-design/icons";
import { Card, DatePicker, Input, Menu, Space, Table } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { Button, Col, Row } from "reactstrap";
import { apis, helper, session } from "../../../../services";
import ModalForm from "./ModalFishType";
import Moment from "react-moment";
import moment from "moment";
export default class FishType extends Component {
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
    this.fetchFishType();
  }

  async fetchFishType() {
    try {
      this.setState({ loading: true });
      let user = await session.get("user");
      let rs = await apis.getAllFT({}, "GET");
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
            placeholder={`Search ${dataIndex}`}
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

        {/* <Col md="6">
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
        </Col> */}
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
      currentFT.date = new Date(currentFT.date);
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
  findFT(id) {
    let tem = this.state.data.find((el) => el.id === id);
    if (tem)
      return (
        <div>
          <span>
            {tem.minWeight} - {tem.maxWeight}
          </span>
        </div>
      );
  }
  render() {
    const { isShowModal, mode, currentFT, data, loading } = this.state;
    let preDate = "";
    let currentDate = "";
    let currentPO = "";
    let currentPage = 0;
    const columns = [
      {
        title: i18n.t("INDEX"),
        dataIndex: "idx",
        key: "idx",
        width: 60,
        //render: (text) => <label>{text}</label>,
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };

          let temp = currentPage;
          currentPage = (value - 1 - ((value - 1) % 10)) / 10;
          if (currentPage !== temp) {
            preDate = "";
            currentDate = "";
            currentPO = "";
          }

          return obj;
        },
      },
      {
        title: i18n.t("Sell Date FT"),
        dataIndex: "date",
        key: "date",
        ...this.getColumnSearchProps("date", true),
        sorter: (a, b) => moment(a.data).unix() - moment(b.date).unix(),
        sortDirections: ["descend", "ascend"],
        //render: (date) => <Moment format="DD/MM/YYYY">{date}</Moment>,
        render: (value, row, index) => {
          const obj = {
            children: <Moment format="DD/MM/YYYY">{value}</Moment>,
            props: {},
          };

          obj.props.rowSpan = 0;
          if (currentDate !== value) {
            data.forEach((element, subindex) => {
              //if (subindex >= 10 * currentPage && subindex < 10 * (currentPage + 1)) {
              if (
                element.date === value &&
                subindex >= 10 * currentPage &&
                subindex < 10 * (currentPage + 1)
              ) {
                obj.props.rowSpan += 1;
              }
              //}
            });
          }

          preDate = currentDate;
          currentDate = value;

          return obj;
        },
      },
      {
        title: "Chủ ao",
        dataIndex: "pondOwner",
        key: "pondOwner",
        ...this.getColumnSearchProps("pondOwner"),
        sorter: (a, b) =>
          a.pondOwner
            ? a.pondOwner.name.length
            : 0 - b.pondOwner.name.length
            ? b.pondOwner.name.length
            : 0,
        sortDirections: ["descend", "ascend"],
        //render: (pondOwner) => pondOwner.name,
        render: (value, row, index) => {
          const obj = {
            children: value.name,
            props: {},
          };

          obj.props.rowSpan = 0;
          if (preDate !== currentDate || currentPO !== value.name) {
            data.forEach((element, subindex) => {
              //if (subindex >= 10 * currentPage && subindex < 10 * (currentPage + 1)) {
              if (
                element.pondOwner.name === value.name &&
                row.date === element.date &&
                subindex >= 10 * currentPage &&
                subindex < 10 * (currentPage + 1)
              ) {
                obj.props.rowSpan += 1;
              }
              //}
            });
          }
          currentPO = value.name;
          return obj;
        },
      },
      {
        title: i18n.t("Fish Name"),
        dataIndex: "fishName",
        key: "fishName",
        ...this.getColumnSearchProps("fishName"),
        sorter: (a, b) =>
          a.fishName
            ? a.fishName.length
            : 0 - b.fishName.length
            ? b.fishName.length
            : 0,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: i18n.t("Range of Weight"),
        colSpan: 1,
        dataIndex: "id",
        key: "id",
        render: (id) => this.findFT(id),
        // ...this.getColumnSearchProps("minWeight"),
        sorter: (a, b) => a.minWeight - b.minWeight,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "Số lượng (kg)",
        dataIndex: "totalWeight",
        key: "totalWeight",
        ...this.getColumnSearchProps("totalWeight"),
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
        title: i18n.t("Buy Price") + i18n.t("(suffix)"),
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
        title: i18n.t("sellPrice(VND)"),
        dataIndex: "transactionPrice",
        key: "transactionPrice",
        ...this.getColumnSearchProps("transactionPrice"),
        sorter: (a, b) =>
          a.transactionprice
            ? a.transactionprice
            : 0 - b.transactionprice
            ? b.transactionprice
            : 0,
        sortDirections: ["descend", "ascend"],
        render: (transactionprice) => (
          <NumberFormat
            value={transactionprice}
            displayType={"text"}
            thousandSeparator={true}
          />
        ),
      },
      // {
      //   title: i18n.t("action"),
      //   dataIndex: "id",
      //   key: "id",
      //   render: (id) => (
      //     <Dropdown overlay={this.renderBtnAction(id)}>
      //       <Button>
      //         <i className="fa fa-cog mr-1" />
      //         <label className="tb-lb-action">{i18n.t("action")}</label>
      //       </Button>
      //     </Dropdown>
      //   ),
      // },
    ];
    return (
      <Card title={this.renderTitle()} className="body-minH">
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
          <Col style={{ overflowX: "auto", overflowY: "auto" }}>
            <Table
              bordered
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10 }}
              scroll={{ y: 600 }}
              loading={loading}
              rowKey={"idx"}
            />
          </Col>
        </Row>
      </Card>
    );
  }
}
