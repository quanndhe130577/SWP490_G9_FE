import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { apis, local, helper } from "../../../services";
import { Card, Dropdown, Menu, Table } from "antd";
// import { useDispatch } from "react-redux";
import i18n from "i18next";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
// import moment from "moment";

const ManaSell = () => {
  let history = useHistory();
  // const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState([]);

  async function onClickBtn(mode, id, row) {
    if (mode === "edit") {
      history.push("sellF?date=" + helper.getDateFormat(row.date, "ddmmyyyy"));
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
      render: (text) => <label>{text}</label>,
    },
    {
      title: i18n.t("Ngày tạo"),
      dataIndex: "date",
      key: "date",
      // ...this.getColumnSearchProps("date"),
      sorter: (a, b) => a.date.length - b.date.length,
      sortDirections: ["descend", "ascend"],
      render: (date) => <Moment format="DD/MM/YYYY">{date}</Moment>,
    },
    {
      title: i18n.t("traderName"),
      dataIndex: "listTrader",
      key: "listTrader",
      render: (listTrader) => {
        let name = "";
        // for (const trader of listTrader) {
        //   if (trader) {
        //     name += trader.lastName + " " + trader.firstName;
        //   }
        // }
        listTrader.forEach((trader, idx) => {
          if (trader) {
            name += trader.firstName + " " + trader.lastName;
          }
          if (idx < listTrader.length - 1) {
            name += ", ";
          }
        });
        return <span>{name}</span>;
      },
    },
    {
      title: i18n.t("totalWeight") + " (Kg)",
      dataIndex: "totalWeight",
      key: "totalWeight",
      // ...this.getColumnSearchProps("totalWeight"),
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
      title: "",
      dataIndex: "id",
      key: "id",
      render: (id, row) => (
        <Button
          style={{ width: "100%" }}
          // color="info"
          color="danger"
          className="mr-2"
          onClick={() => onClickBtn("edit", id, row)}
        >
          <i className="fa fa-pencil-square-o mr-1" />
          Chi tiết
          {/* {i18n.t("transaction.action.continue")} */}
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
                "sellF?date=" + helper.getDateFormat(new Date(), "ddmmyyyy")
              );
              // history.push("sellF");
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
    <Card title={renderTitle()}>
      <Table columns={columns} dataSource={transaction} loading={isLoading} />
    </Card>
  );
};
export default ManaSell;
