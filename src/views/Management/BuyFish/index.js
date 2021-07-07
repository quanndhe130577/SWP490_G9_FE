import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import apis from "../../../services/apis";
import helper from "../../../services/helper";
import local from "../../../services/local";
import { Card, Dropdown, Menu, Table } from "antd";
import { useDispatch } from "react-redux";
import i18n from "i18next";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";
import NumberFormat from "react-number-format";

const ManaBuy = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState([]);

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
      try {
        helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
          if (rs) {
            setLoading(true);
            let rs = await apis.deletePurchase({ purchaseId: id });
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

  function renderBtnAction(id) {
    return (
      <Menu>
        <Menu.Item>
          <Button
            color="info"
            className="mr-2"
            onClick={() => onClick("edit", id)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t("edit")}
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button color="danger" onClick={() => onClick("delete", id)}>
            <i className="fa fa-trash-o mr-1" />
            {i18n.t("delete")}
          </Button>
        </Menu.Item>
      </Menu>
    );
  }

  const columns = [
    {
      title: i18n.t("INDEX"),
      dataIndex: "idx",
      key: "idx",
      render: (text) => <label>{text}</label>,
    },
    {
      title: i18n.t("pondOwnerName"),
      dataIndex: "pondOwnerName",
      key: "pondOwnerName",
      // ...this.getColumnSearchProps("pondOwnerName"),
      sorter: (a, b) => a.pondOwnerName.localeCompare(b.pondOwnerName),
      sortDirections: ["descend", "ascend"],
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
      title: i18n.t("totalWeight"),
      dataIndex: "totalWeight",
      key: "totalWeight",
      // ...this.getColumnSearchProps("totalWeight"),
      sorter: (a, b) => a.totalWeight - b.totalWeight,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: i18n.t("totalAmount (VND)"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      // ...this.getColumnSearchProps("totalAmount"),
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
      title: "",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Dropdown overlay={renderBtnAction(id)}>
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
          <h3 className="">{i18n.t("goodManagement")}</h3>
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
      <Button
        color="info"
        className="mb-2"
        onClick={() => {
          history.push("buyFish");
        }}
      >
        {i18n.t("newPurchase")}
      </Button>
      {/*<Button*/}
      {/*  color="info"*/}
      {/*  onClick={() => {*/}
      {/*    history.push("buyFish");*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {i18n.t("continueToBuy")}*/}
      {/*</Button>*/}
      <Table columns={columns} dataSource={purchase} loading={isLoading} />
    </Card>
  );
};
export default ManaBuy;
