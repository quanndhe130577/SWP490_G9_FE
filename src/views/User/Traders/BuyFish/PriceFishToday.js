import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";
import i18n from "i18next";
import { Button } from "reactstrap";
import apis from "../../../../services/apis";

const PriceFishToday = ({ listFishId, onChange, dataDf, dataChange }) => {
  const [dataS, setData] = useState([]);

  const onChangeWeight = (value, id, name) => {
    const newDatas = [...dataS];
    const index = dataS.findIndex((x) => x && parseInt(x.id) === parseInt(id));
    if (index !== -1) {
      const newItem = { ...newDatas[index], [name]: value };
      newDatas.splice(index, 1, newItem);
      setData(newDatas);
      dataChange(newDatas);
    }
    // this.setData({ ...dataS[0], maxWeight: value }),
  };

  const onAddFish = async () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + mm + yyyy;

    let rs = await apis.getNewFishType({}, "POST", today);

    const newDatas = [...dataS];
    const index = dataS.findIndex((x) => x.id === rs.data.id);
    if (index === -1) {
      rs.data.idx = newDatas.length + 1;
      newDatas.push(rs.data);
      setData(newDatas);
      dataChange(newDatas);
    }
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
      render: (fishName, record) => (
        <Input
          defaultValue={fishName}
          onChange={(e) =>
            onChangeWeight(e.target.value, record.id, "fishName")
          }
        />
      ),
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
          onChange={(e) =>
            onChangeWeight(e.target.value, record.id, "maxWeight")
          }
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
    if (temArr.length !== 0) {
      dataChange(arr);
    }
  };
  useEffect(() => {
    findList(listFishId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listFishId]);
  return (
    <div style={{ overflowX: "auto" }}>
      <Table
        columns={columns}
        dataSource={dataS}
        summary={(pageData) => {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan="6" key="1">
                  <Button color="info" className="w-100" onClick={onAddFish}>
                    +
                  </Button>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
};

export default PriceFishToday;
