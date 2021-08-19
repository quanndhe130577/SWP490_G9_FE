import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { apis, local, helper } from "../../../services";
import { Card, Table, Tag, DatePicker, Input, Space } from "antd";
import i18n from "i18next";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import { session } from "../../../services";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
const ManaSell = () => {
  let history = useHistory();
  // const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const user = session.get("user");

  async function onClickBtn(mode, id, row) {
    if (mode === "edit") {
      history.push(
        "sellFish?date=" + helper.getDateFormat(row.date, "ddmmyyyy")
      );
      local.set(
        "historyTransaction",
        transaction.find((e) => e.id === id)
      );
      // dispatch({
      //   type: "SET_PURCHASE",
      //   currentTransaction: transaction.find((e) => e.id === id),
      // });
    } else if (mode === "delete") {
      try {
        helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
          if (rs) {
            setLoading(true);
            let rs = await apis.deleteTransaction({ transactionId: id });
            if (rs && rs.statusCode === 200) {
              setLoading(false);
              helper.toast("success", i18n.t(rs.message));
              fetchData();
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
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
            Tìm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
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
    render: (text) => (searchedColumn === dataIndex ? <div>{text}</div> : text),
  });
  // function renderBtnAction(id, row) {
  //   return (
  //     <Menu>
  //       <Menu.Item key="1">
  //         <Button
  //           style={{ width: "100%" }}
  //           color="info"
  //           className="mr-2"
  //           onClick={() => onClickBtn("edit", id, row)}
  //         >
  //           <i className="fa fa-pencil-square-o mr-1" />
  //           {i18n.t("transaction.action.continue")}
  //         </Button>
  //       </Menu.Item>
  //       <Menu.Item key="2">
  //         <Button
  //           color="danger"
  //           onClick={() => onClickBtn("delete", id, row)}
  //           style={{ width: "100%" }}
  //         >
  //           <i className="fa fa-trash-o mr-1" />
  //           {i18n.t("delete")}
  //         </Button>
  //       </Menu.Item>
  //     </Menu>
  //   );
  // }

  const columns = [
    {
      title: i18n.t("INDEX"),
      dataIndex: "idx",
      key: "idx",
      width: 60,

      render: (text) => <label>{text}</label>,
    },
    {
      title: i18n.t("Ngày tạo"),
      dataIndex: "date",
      key: "date",
      ...getColumnSearchProps("date", true),
      // sorter: (a, b) => a.date.length - b.date.length,
      // sortDirections: ["descend", "ascend"],
      render: (date) => <Moment format="DD/MM/YYYY">{date}</Moment>,
    },
    {
      title: i18n.t(
        user.roleName === "Trader" ? "weightRecorder" : "traderName"
      ),
      dataIndex: "listTrader",
      key: "listTrader",
      render: (listTrader, row) => {
        // let name = "";

        if (user.roleName !== "Trader") {
          // listTrader.forEach((trader, idx) => {
          //   if (trader) {
          //     name += trader.firstName + " " + trader.lastName;
          //   }
          //   if (idx < listTrader.length - 1) {
          //     name += ", ";
          //   }
          // });
          return listTrader.map((trader, idx) => (
            <Tag key={idx}>
              {trader.firstName} {trader.lastName}
            </Tag>
          ));
        } else {
          // if (row.listWeightRecorder.length === 0) {
          //   name += "tự bán";
          // } else {
          // row.listWeightRecorder.forEach((wr, idx) => {
          //   if (wr && (wr.firstName || wr.lastName)) {
          //     name += wr.firstName + " " + wr.lastName;
          //   }
          //   if (idx < row.listWeightRecorder.length - 1) {
          //     name += ", ";
          //   }
          // });
          // }
          return row.listWeightRecorder.map((wr, idx) => (
            <Tag key={idx}>
              {wr.firstName} {wr.lastName}
            </Tag>
          ));
        }
      },
    },
    {
      title: i18n.t("totalWeight") + " (Kg)",
      dataIndex: "totalWeight",
      key: "totalWeight",
      sorter: (a, b) => a.totalWeight - b.totalWeight,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: i18n.t("totalAmount (VND)"),
      dataIndex: "totalMoney",
      key: "totalMoney",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortDirections: ["descend", "ascend"],
      render: (totalAmount) => (
        <NumberFormat
          value={totalAmount}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
    {
      title: i18n.t("debt") + " (VND)",
      dataIndex: "totalDebt",
      key: "totalDebt",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortDirections: ["descend", "ascend"],
      render: (totalDebt) => (
        <NumberFormat
          value={totalDebt}
          displayType={"text"}
          thousandSeparator={true}
        />
      ),
    },
    {
      title: i18n.t("action"),
      dataIndex: "id",
      key: "id",
      render: (id, row) => (
        <Button
          style={{ width: "100%" }}
          color="info"
          // color="danger"
          className="mr-2"
          onClick={() => onClickBtn("edit", id, row)}
        >
          <i className="fa fa-pencil-square-o mr-1" />
          {i18n.t("action.purchase.detail")}
        </Button>
      ),
    },
  ];

  async function fetchData() {
    try {
      setLoading(true);
      // let date = moment(new Date()).format("DDMMYYYY");
      // let rs = await apis.getTransByDate({}, "GET", date);
      let rs = await apis.getGeneralTrans({}, "GET");

      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        setTransaction(rs.data);
        // dispatch({
        //   type: "SET_TRANSACTION",
        //   transaction: rs.data,
        // });
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
          <h3 className="">{i18n.t("sellFish")}</h3>
        </Col>
        <Col md="6">
          <Button
            color="info"
            className="mb-2 pull-right"
            onClick={() => {
              history.push(
                "sellFish?date=" + helper.getDateFormat(new Date(), "ddmmyyyy")
              );
            }}
          >
            {i18n.t("transaction.continueSelling")}
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
        dataSource={transaction}
        loading={isLoading}
        rowKey="idx"
        bordered
      />
    </Card>
  );
};
export default ManaSell;
