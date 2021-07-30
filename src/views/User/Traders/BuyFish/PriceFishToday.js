import React, { useEffect, useState } from "react";
import { Input, Table } from "antd";
import i18n from "i18next";
import { Button } from "reactstrap";
import apis from "../../../../services/apis";
import Widgets from "../../../../schema/Widgets";

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

  const onRemoveFish = (id) => {
    const newDatas = [...dataS];
    const index = dataS.findIndex((x) => x.id === id);
    if (index !== -1) {
      // rs.data.idx = newDatas.length + 1;
      newDatas.splice(index, 1);
      setData(newDatas);
      dataChange(newDatas);

      // chưa cập nhật lại được listFishId ở chosePond
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "idx",
      key: "idx",
      width: "5%",
      render: (text) => <label>{text}</label>,
    },
    {
      title: "Tên cá",
      dataIndex: "fishName",
      key: "fishName",
      width: "20%",
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
      width: "12%",
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
      width: "12%",
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
      title: "Giá mua\n(VND/kg)",
      dataIndex: "price",
      key: "price",
      width: "18%",
      render: (price, record) => (
        <Widgets.MoneyInput
          value={price}
          onChange={(e) => onChangeWeight(e, record.id, "price")}
        />
      ),
    },
    {
      title: "Giá bán\n(VND/kg)",
      dataIndex: "transactionPrice",
      key: "transactionPrice",
      width: "18%",
      render: (transactionPrice, record) => (
        <Widgets.MoneyInput
          value={transactionPrice}
          onChange={(e) => onChangeWeight(e, record.id, "transactionPrice")}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      //width: "10%",
      render: (text, record) => (
        <div size="middle">
          {/* <label>{i18n.t("edit")}</label> */}
          <Button
            color="danger"
            size="sm"
            className="w-25"
            onClick={() => onRemoveFish(record.id)}
          >
            x
          </Button>
        </div>
      ),
    },
  ];

  const findList = (temArr) => {
    let arr = [];
    let count = 0;
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
                <Table.Summary.Cell colSpan="7" key="1">
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
