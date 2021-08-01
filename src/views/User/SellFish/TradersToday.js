import React, { useEffect, useState } from "react";
import { Table } from "antd";
import i18n from "i18next";
// import Widgets from "../../../schema/Widgets";

const TradersToday = ({ listTraderId, onChange, dataFetched }) => {
  const columns = [
    {
      title: i18n.t("INDEX"),
      dataIndex: "idx",
      key: "idx",
      render: (text) => <label>{text}</label>,
    },
    {
      title: i18n.t("name"),
      dataIndex: "firstName",
      key: "firstName",

      render: (firstName, record) => (
        <label>{firstName + " " + record.lastName}</label>
      ),
    },
    {
      title: i18n.t("address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: i18n.t("phoneNumber"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      // render: (id) => (
      //   <Dropdown overlay={this.renderBtnAction(id)}>
      //     <Button>
      //       <i className="fa fa-cog mr-1" />
      //       <label className="tb-lb-action">{i18n.t("action")}</label>
      //     </Button>
      //   </Dropdown>
      // ),
    },
  ];
  const [dataS, setData] = useState([]);
  const findList = (temArr) => {
    let arr = [],
      count = 0;
    temArr.forEach((el) => {
      let tem = dataFetched.traders.find((ft) => ft.id === parseInt(el));
      if (tem) {
        tem.idx = ++count;
        arr.push(tem);
      }
    });

    if (onChange) {
      onChange(arr);
    }
    setData(arr);
  };
  useEffect(() => {
    findList(listTraderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTraderId]);
  return (
    <div style={{ overflowX: "auto" }}>
      <Table columns={columns} dataSource={dataS} />
    </div>
  );
};

export default TradersToday;
