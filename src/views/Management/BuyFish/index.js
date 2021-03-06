/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import apis from "../../../services/apis";
import helper from "../../../services/helper";
import local from "../../../services/local";
import {
  Card,
  DatePicker,
  Dropdown,
  Input,
  Menu,
  Space,
  Table,
  Tag,
} from "antd";
import { useDispatch } from "react-redux";
import i18n from "i18next";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
const ManaBuy = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);

  // const [mode, setMode] = useState("");
  // const [data, setData] = useState([]);
  // const [searchInput, setSearchInput] = useState("");
  // const [loading, setLoading] = useState(true);

  async function onClick(mode, id) {
    if (mode === "edit") {
      history.push("buyFish?id=" + id);
      local.set(
        "historyPurchase",
        purchase.find((e) => e.id === id)
      );
      // dispatch({
      //   type: "SET_PURCHASE",
      //   currentPurchase: purchase.find((e) => e.id === id),
      // });
    } else if (mode === "delete") {
      helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
        if (rs) {
          try {
            setLoading(true);
            let rs = await apis.deletePurchase({ purchaseId: id });
            if (rs && rs.statusCode === 200) {
              helper.toast("success", i18n.t(rs.message));
              fetchData();
            }
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }
      });
    }
  }
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // const closeModal = (refresh) => {
  //   if (refresh === true) {
  //     fetchData();
  //   }
  //   // this.setState({ isShowModal: false, mode: "", currentEmp: {} });
  //   setIsShowModal(false);
  //   // setMode("");
  //   setPurchase({});
  // };
  const getColumnSearchProps = (dataIndex, isDate = false) => ({
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
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            onPressEnter={() => {
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            format={"DD/MM/YYYY"}
            style={{ marginBottom: 8, display: "block" }}
          />
        ) : (
          <Input
            ref={(node) => {
              // eslint-disable-next-line no-const-assign
              // searchInput = node;
            }}
            placeholder={`${i18n.t("Search")} ${i18n.t(dataIndex)}`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
        )}
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            T??m
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            ?????t l???i
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
    render: (text) => (searchedColumn === dataIndex ? <div>{text}</div> : text),
  });

  function renderBtnAction(id, record) {
    return (
      <Menu>
        <Menu.Item key="1">
          <Button
            style={{ width: "100%" }}
            color="info"
            className="mr-2"
            onClick={() => onClick("edit", id)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t(
              record.status === "Pending"
                ? "buyContinue"
                : "action.purchase.detail"
            )}
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button
            color="danger"
            onClick={() => onClick("delete", id)}
            style={{ width: "100%" }}
          >
            <i className="fa fa-trash-o mr-1" />
            {i18n.t("delete")}
          </Button>
        </Menu.Item>
      </Menu>
    );
  }

  let currentDate = "";
  let preDate = "";
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
        }

        return obj;
      },
    },
    {
      title: i18n.t("Ng??y t???o"),
      dataIndex: "date",
      key: "date",
      ...getColumnSearchProps("date", true),

      // sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),

      // sortDirections: ["descend", "ascend"],
      render: (value, row, index) => {
        // if (index === 0) {
        //   currentDate = "";
        //   preDate = "";
        //   currentPage = 0;
        // }
        const obj = {
          children: <Moment format="DD/MM/YYYY">{value}</Moment>,
          props: {},
        };

        obj.props.rowSpan = 0;
        if (helper.getDateFormat(currentDate) !== helper.getDateFormat(value)) {
          purchase.forEach((element, subindex) => {
            if (
              helper.getDateFormat(element.date) ===
                helper.getDateFormat(value) &&
              subindex >= 10 * currentPage &&
              subindex < 10 * (currentPage + 1)
            ) {
              obj.props.rowSpan += 1;
            }
          });
        }

        preDate = currentDate;
        currentDate = value;

        return obj;
      },
    },
    {
      title: i18n.t("pondOwnerName"),
      dataIndex: "pondOwnerName",
      key: "pondOwnerName",
      // ...getColumnSearchProps("pondOwnerName"),
      // sorter: (a, b) => a.pondOwnerName.localeCompare(b.pondOwnerName),
      // sortDirections: ["descend", "ascend"],
    },

    {
      title: i18n.t("totalWeight"),
      dataIndex: "totalWeight",
      key: "totalWeight",
      // ...getColumnSearchProps("totalWeight"),
      // sorter: (a, b) => a.totalWeight - b.totalWeight,
      // sortDirections: ["descend", "ascend"],
    },
    {
      title: i18n.t("totalAmount (VND)"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      // ...getColumnSearchProps("totalAmount"),
      // sorter: (a, b) => a.totalAmount - b.totalAmount,
      // sortDirections: ["descend", "ascend"],
      render: (totalAmount) => (
        <NumberFormat
          value={totalAmount.toFixed(0)}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
    {
      title: i18n.t("statusPaid"),
      dataIndex: "isPaid",
      key: "isPaid",
      render: (isPaid) => helper.tag(isPaid ? "isPaid" : "isNotDone", "w-140px"),
    },
    {
      title: i18n.t("statusBuy"),
      dataIndex: "status",
      key: "status",
      render: (status) => helper.tag(status, "w-120px"),
    },

    {
      title: i18n.t("action"),
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <Dropdown overlay={renderBtnAction(id, record)}>
          <Button>
            <i className="fa fa-cog mr-1" />
            <label className="tb-lb-action">{i18n.t("action")}</label>
          </Button>
        </Dropdown>
      ),
    },
  ];

  async function fetchData() {
    try {
      setLoading(true);
      let rs = await apis.getPurchases({}, "GET");
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        setPurchase(rs.data);
        dispatch({
          type: "SET_PURCHASE",
          purchase: rs.data,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const renderTitle = () => {
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("buyFish")}</h3>
        </Col>
        <Col md="6">
          <Button
            color="info"
            className="mb-2 pull-right"
            onClick={() => {
              local.set("currentPurchase", {});
              history.push("buyFish");
            }}
          >
            {i18n.t("newPurchase")}
          </Button>
        </Col>
      </Row>
    );
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title={renderTitle()} className="body-minH">
      <Table
        columns={columns}
        dataSource={purchase}
        loading={isLoading}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        // onChange={() => {
        //   currentDate = "";
        //   preDate = "";
        //   currentPage = 0;
        // }}
      />
    </Card>
  );
};
export default ManaBuy;
