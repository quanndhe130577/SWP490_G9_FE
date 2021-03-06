import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { Col } from "reactstrap";
import NumberFormat from "react-number-format";
import { apis } from "../../../services";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";

const RenderTB = ({
  transaction,
  param,
  isLast,
  handleRemain,
  disabledBtn = false,
  traderId,
}) => {
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
        ele.totalWeight += el.realWeight ? el.realWeight : el.weight;
        ele.totalAmount +=
          el.sellPrice * (el.realWeight ? el.realWeight : el.weight);
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
        if (transaction.status !== "Completed") {
          remainF.map((el) =>
            el.remainWeight >= 0
              ? (el.realWeight = el.remainWeight)
              : (el.realWeight = 0)
          );
        }

        if (param) {
          setCurrentTransaction((pre) => ({
            ...pre,
            remainF,
          }));
          handleRemain(remainF);
        }
        return rs.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  const onChangeWeight = (value, id, name) => {
    let { remainF } = currentTransaction;
    const newDatas = [...remainF];
    const index = remainF.findIndex(
      (x) => x && parseInt(x.id) === parseInt(id)
    );
    if (index !== -1) {
      const newItem = { ...newDatas[index], [name]: value || 0 };
      newDatas.splice(index, 1, newItem);
      setCurrentTransaction((pre) => ({
        ...pre,
        remainF: newDatas,
      }));
      handleRemain(newDatas);
    }
  };
  useEffect(() => {
    if (param) {
      calculateData(transaction.transactionDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  const columns2 = [
    {
      title: "T??n c??",
      dataIndex: "fishName",
      key: "fishName",
    },
    {
      title: "Kh???i l?????ng ?????c t??nh (Kg)",
      dataIndex: "remainWeight",
      key: "remainWeight",
      render: (weight) => (
        <Widgets.NumberFormat
          needSuffix={false}
          value={weight && weight.toFixed(1)}
        />
      ),
    },
    {
      title: "Kh???i l?????ng th???c t??? (Kg)",
      dataIndex: "realWeight",
      key: "realWeight",
      render: (weight, record) => (
        <Widgets.WeightInput
          value={weight}
          onChange={(e) => onChangeWeight(e, record.id, "realWeight")}
          isDisable={disabledBtn}
        />
      ),
    },
    {
      title: "",
      dataIndex: "realWeight",
      key: "realWeight",
      render: (weight, record) => (
        <Widgets.Checkbox
          value={weight ? false : true}
          onChange={(e) => onChangeWeight(e ? 0 : 0, record.id, "realWeight")}
          lblCheckbox={i18n.t("B??? ??i")}
          disabled={disabledBtn}
        />
      ),
    },
  ];
  return (
    <>
      {/* FOR REMAIN FISH, DONT REMOVE  */}
      {isLast && !traderId ? (
        <>{currentTransaction.remainF && currentTransaction.remainF.length > 0 && <Col md="12" className="mb-4">
          <b>S??? c?? c??n l???i</b>
          <Table
            rowKey="id"
            columns={columns2}
            dataSource={currentTransaction.remainF}
            bordered
            pagination={false}
            summary={(pageData) => {
              let totalRemain = 0;
              let realRemain = 0;
              pageData.forEach(({ remainWeight, realWeight }) => {
                if (remainWeight > 0) totalRemain += parseFloat(remainWeight);
                if (realWeight > 0) realRemain += parseFloat(realWeight);
              });
              return (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell key="1" className="bold">
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
                    <Table.Summary.Cell key="3" className="bold" colSpan="2">
                      <NumberFormat
                        value={realRemain && realRemain.toFixed(1)}
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
        </Col>
        }</>
      ) : (
        <>
          {transaction.weightRecorder &&
            currentTransaction.fishInPurchase.length > 0 && (
              <Col md="12" className="mb-3">
                <span className="mr-3 my-2">
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
                          <Table.Summary.Cell key="1" className="bold">
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
            )}
        </>
      )}
    </>
  );
};

export default RenderTB;
const columns = [
  {
    title: "T??n c??",
    dataIndex: "fishName",
    key: "fishName",
  },
  {
    title: "T???ng kh???i l?????ng (Kg)",
    dataIndex: "totalWeight",
    key: "totalWeight",
    render: (weight) => (
      <Widgets.NumberFormat
        needSuffix={false}
        value={weight && weight.toFixed(1)}
      />
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
      <Widgets.NumberFormat
        needSuffix={false}
        value={totalAmount && totalAmount.toFixed(0)}
      />
    ),
  },
];
