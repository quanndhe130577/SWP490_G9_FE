import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";
import i18n from "i18next";

const PriceFishToday = ({ listFishId, onChange, dataDf, dataChange }) => {
  const [dataS, setData] = useState([]);

  const onChangeWeight = (value, id, name) => {
    const newDatas = [...dataS];
    const index = dataS.findIndex((x) => x.id === id);
    if (index !== -1) {
      const newItem = { ...newDatas[index], [name]: value };
      newDatas.splice(index, 1, newItem);
      setData(newDatas);
      dataChange(newDatas);
    }
    // this.setData({ ...dataS[0], maxWeight: value }),
  };

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
      render: (minWeight, record) => (
        <Input
          defaultValue={minWeight}
          onChange={(e) =>
            onChangeWeight(e.target.value, record.id, "minWeight")
          }
        />
      ),
    },
    {
      title: "Trọng lượng tối đa",
      dataIndex: "maxWeight",
      key: "maxWeight",
      render: (maxWeight, record) => (
        <Input
          defaultValue={maxWeight}
          onChange={(e) => onChangeWeight(e.target.value, record.id, maxWeight)}
        />
      ),
    },
    {
      title: "Giá (VND/kg)",
      dataIndex: "price",
      key: "price",
      render: (price, record) => (
        <Input
          defaultValue={price}
          onChange={(e) => onChangeWeight(e.target.value, record.id, "price")}
        />
      ),
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
  const findList = (temArr) => {
    let arr = [],
      count = 0;
    temArr.forEach((el) => {
      let tem = dataDf.fishType.find((ft) => ft.id === parseInt(el));
      if (tem) {
        tem.idx = ++count;
        arr.push(tem);
      }
    });

    if (onChange) {
      onChange(arr);
    }
    setData(arr);
    dataChange(arr);
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
