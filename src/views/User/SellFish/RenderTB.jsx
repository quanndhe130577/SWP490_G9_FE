import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { Col } from "reactstrap";
import NumberFormat from "react-number-format";
import { apis } from "../../../services";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
const RenderTB = ({ transaction, param, isLast }) => {
  const [total, setTotal] = useState({});
  const [currentTransaction, setCurrentTransaction] = useState({
    fishInPurchase: [],
    remainF: [],
    buyLater: true,
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
        let remainF = rs.data.filter(
          (el) => el.remainWeight && el.remainWeight !== 0
        );
        if (param) {
          setCurrentTransaction((pre) => ({
            ...pre,
            remainF,
          }));
        }
        return rs.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (param) {
      calculateData(transaction.transactionDetails, param);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);

  if (currentTransaction.fishInPurchase.length > 0)
    return (
      <>
        {isLast && (
          <Col md="6">
            <b>Số cá còn lại</b>
            <Table
              rowKey="id"
              columns={columns2}
              dataSource={currentTransaction.remainF}
              bordered
              pagination={false}
              summary={(pageData) => {
                let totalRemain = 0;
                pageData.forEach(({ remainWeight }) => {
                  totalRemain += remainWeight;
                });
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
                          value={totalRemain.toFixed(1)}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix=" Kg"
                        />
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
            />

            <Widgets.Checkbox
              value={!currentTransaction.buyLater}
              onChange={() =>
                setCurrentTransaction((pre) => ({
                  ...pre,
                  buyLater: !currentTransaction.buyLater,
                }))
              }
              lblCheckbox={i18n.t("Bỏ đi")}
            />
            <Widgets.Checkbox
              lblCheckbox={i18n.t("Chuyển sang hôm sau")}
              value={currentTransaction.buyLater}
              onChange={(val) =>
                setCurrentTransaction((pre) => ({
                  ...pre,
                  buyLater: val,
                }))
              }
            />
          </Col>
        )}
        <Col md="12" className="mb-3">
          <span className="mr-3">
            <b>{i18n.t("weightRecorder")}: </b>
            {transaction.weightRecorder.firstName +
              " " +
              transaction.weightRecorder.lastName}
          </span>

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
      </>
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
const columns2 = [
  {
    title: "Tên cá",
    dataIndex: "fishName",
    key: "fishName",
  },
  {
    title: "Khối lượng còn lại (kg)",
    dataIndex: "remainWeight",
    key: "remainWeight",
    render: (weight) => (
      <Widgets.NumberFormat needSuffix={false} value={weight} />
    ),
  },
  // {
  //   title: (
  //     <div>
  //       <label>{i18n.t("intoMoney")}</label>
  //     </div>
  //   ),
  //   dataIndex: "totalAmount",
  //   key: "totalAmount",
  //   render: (totalAmount) => (
  //     <Widgets.NumberFormat needSuffix={false} value={totalAmount} />
  //   ),
  // },
];
