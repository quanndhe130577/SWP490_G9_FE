import React, { useEffect, useState } from "react";
import { Table, Space } from "antd";
import data from "../../../../data";
import Widgets from "../../../../schema/Widgets";

const PriceFishToday = ({ listFish, onChange }) => {
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text) => <label>{text}</label>,
    },
    {
      title: "Tên cá",
      dataIndex: "label",
      key: "label",
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
        <Space size="middle">
          <label>Invite {record.name}</label>
          <label>Delete</label>
        </Space>
      ),
    },
  ];
  const [dataS, setData] = useState([]);
  const findList = (temArr) => {
    let arr = [];
    temArr.forEach((el) => {
      let tem = data.fishType.find((ft) => ft.value === parseInt(el));
      if (tem) arr.push(tem);
    });

    if (onChange) {
      onChange(arr);
    }
    setData(arr);
  };
  useEffect(() => {
    findList(listFish);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFish]);
  return (
    <div style={{ overflowX: "auto" }}>
      <Table columns={columns} dataSource={dataS} />
    </div>
  );
};

export default PriceFishToday;
