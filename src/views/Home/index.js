import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import apis from "../../services/apis";
import {
  Table,
  //  Input, Space, Card,
  Dropdown,
  Menu,
} from "antd";

import i18n from "i18next";
// import helper from "../../services/helper";
// import { SearchOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import Moment from "react-moment";

const Dashboard = () => {
  let history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [purchase, setPurchase] = useState([]);

  function onClick(id) {
    history.push("buyF?id=" + id);
  }

  function renderBtnAction(id) {
    return (
      <Menu>
        <Menu.Item>
          <Button color="info" className="mr-2" onClick={() => onClick(id)}>
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t("edit")}
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            color="danger"
            // onClick={() => onClick("delete", id)}
          >
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
      title: i18n.t("totalAmount"),
      dataIndex: "totalAmount",
      key: "totalAmount",
      // ...this.getColumnSearchProps("totalAmount"),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <Dropdown overlay={renderBtnAction(id)}>
          <Button>
            <i className="fa fa-cog mr-1" />
            {i18n.t("action")}
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Button
        color="info"
        onClick={() => {
          history.push("buyF");
          // helper.useHistory("buy");
        }}
      >
        {i18n.t("buyGood")}
      </Button>
      <Table columns={columns} dataSource={purchase} loading={isLoading} />
    </div>
  );
};
export default Dashboard;
