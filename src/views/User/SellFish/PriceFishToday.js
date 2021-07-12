import React, { useEffect, useState } from "react";
import { Table } from "antd";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";

const PriceFishToday = ({ listFishId, onChange, dataDf }) => {
  const columns = [
    {
      title: "STT",
      dataIndex: "idx",
      key: "idx",
      render: (text) => <label>{text}</label>,
    },
    {
      title: "Tên cá",
      dataIndex: "fishName",
      key: "fishName",
    },
    {
      title: "Trọng lượng tối thiểu",
      dataIndex: "minWeight",
      key: "minWeight",
    },
    {
      title: "Trọng lượng tối đa",
      dataIndex: "maxWeight",
      key: "maxWeight",
    },
    {
      title: "Giá (VND/kg)",
      dataIndex: "price",
      key: "price",
      render: (price) => <Widgets.NumberFormat value={price} />,
    },

    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <div size="middle">
          <label>{i18n.t("edit")}</label>
        </div>
      ),
    },
  ];
  const [dataS, setData] = useState([]);
  const findList = (temArr) => {
    let arr = [],
      count = 0;
    temArr.forEach((el) => {
      debugger
      //if (dataDf.fishType != null && dataDf.fishType != "undefined") {
        let tem = dataDf.fishType.find((ft) => ft.id === parseInt(el));
        if (tem) {
          tem.idx = ++count;
          arr.push(tem);
        }
      //}
    });

    if (onChange) {
      onChange(arr);
    }
    setData(arr);
  };
  useEffect(() => {
    findList(listFishId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFishId]);
  return (
    <div style={{ overflowX: "auto" }}>
      <Table columns={columns} dataSource={dataS} />
    </div>
  );
};

export default PriceFishToday;
