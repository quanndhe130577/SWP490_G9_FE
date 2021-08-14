import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { Col } from "reactstrap";
import NumberFormat from "react-number-format";
import { apis } from "../../../services";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
const RenderTB = ({ transaction, param }) => {
  const [total, setTotal] = useState({});
  const [currentTransaction, setCurrentTransaction] = useState({
    fishInPurchase: [],
  });

  async function calculateData(arr) {
    let arrFish = await getFTByTrader(param);

    // eslint-disable-next-line array-callback-return
    arrFish.map((ele) => {
      if (!ele.totalWeight || !ele.totalAmount) {
        ele.totalWeight = 0;
        ele.totalAmount = 0;
      }
      let tem = arr.filter((el) => el.fishType.id === ele.id);
      tem.forEach((el) => {
        ele.totalWeight += el.weight;
        ele.totalAmount += el.sellPrice * el.weight;
      });
    });
    let totalAmount = 0,
      totalWeight = 0;
    arr.forEach(({ weight, sellPrice }) => {
      totalWeight += weight;
      totalAmount += sellPrice * weight;
    });
    setTotal({ totalAmount, totalWeight });
    let fishInPurchase = arrFish.filter((fi) => fi.totalWeight > 0);
    setCurrentTransaction((pre) => ({
      ...pre,
      fishInPurchase,
    }));
  }
  async function getFTByTrader(param) {
    try {
      let rs = await apis.getFTByTrader({}, "GET", param);
      if (rs && rs.statusCode === 200) {
        return rs.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    calculateData(transaction.transactionDetails, param);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  if (currentTransaction.fishInPurchase.length > 0)
    return (
      <Col md="12" className="mb-3">
        {transaction.weightRecorder.firstName}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={currentTransaction.fishInPurchase}
          bordered
          pagination={false}
          summary={() => {
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell
                    key="1"
                    // colSpan="2"
                    className="bold"
                  >
                    {i18n.t("total")}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell key="2" className="bold">
                    <NumberFormat
                      value={total.totalWeight.toFixed(1)}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix=" Kg"
                    />
                  </Table.Summary.Cell>
                  <Table.Summary.Cell key="3" className="bold">
                    <NumberFormat
                      value={total.totalAmount}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix=" VND"
                    />
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Col>
    );

  return <div></div>;
};

export default RenderTB;
const columns = [
  {
    title: "Tên cá",
    dataIndex: "fishName",
    key: "fishName",
  },
  {
    title: "Tổng khối lượng (kg)",
    dataIndex: "totalWeight",
    key: "totalWeight",
    render: (weight) => (
      <Widgets.NumberFormat needSuffix={false} value={weight} />
    ),
  },
  {
    title: (
      <div>
        <label>{i18n.t("intoMoney")}</label>
      </div>
    ),
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (totalAmount) => (
      <Widgets.NumberFormat needSuffix={false} value={totalAmount} />
    ),
  },
];
