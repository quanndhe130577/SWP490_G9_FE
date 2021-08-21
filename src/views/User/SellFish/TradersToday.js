import React, { useEffect, useState } from "react";
import { Table } from "antd";
import i18n from "i18next";

const TradersToday = ({ listTraderId, onChange, dataFetched }) => {
  const columns = [
    {
      title: i18n.t("INDEX"),
      dataIndex: "idx",
      key: "idx",
      width: 60,

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
      <Table
        columns={columns}
        dataSource={dataS}
        rowKey="idx"
        bordered
        pagination={false}
      />
    </div>
  );
};

export default TradersToday;
