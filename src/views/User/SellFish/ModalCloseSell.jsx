import React, { useState, useEffect } from "react";
import Modal from "../../../containers/Antd/ModalCustom";
import { Table } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import { apis, helper, session } from "../../../services";
import NumberFormat from "react-number-format";
import RenderTB from "./RenderTB";
import moment from "moment";
const ModalCloseSell = ({
  isShowCloseTransaction,
  listTransaction,
  handleCloseModal,
  dataDf,
  handleCloseTrans,
  date,
  traderId,
  handleChangeTraderId,
  transId,
}) => {
  const [currentTransaction, setCurrentTransaction] = useState({
    fishInPurchase: [],
  });
  const [total, setTotal] = useState({});
  const [remain, setRemain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [param, setParam] = useState("");
  const user = session.get("user");

  const handleOk = () => {
    helper.confirm("Bạn có chắc chắn chốt sổ?").then((rs) => {
      if (rs) {
        try {
          setLoading(true);
          let check = validate();
          if (!check) {
            let { commissionUnit, tranId } = currentTransaction;
            if (handleCloseTrans) {
              handleCloseTrans({
                commissionUnit,
                tranId,
                listRemainFish: remain,
                date: helper.correctDate(moment(date, "DDMMYYYY")),
              });
            }
          } else {
            helper.toast("error", i18n.t(check));
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const validate = () => {
    let { commissionUnit, tranId } = currentTransaction;
    if (!commissionUnit && user.roleName !== "Trader") {
      return "commissionUnitCanNull";
    } else if (!tranId) {
      return "traderUnitCanNull";
    }
  };
  const handleCancel = () => {
    handleCloseModal(!isShowCloseTransaction);
  };
  const handleChangeTran = async (name, val, transId) => {
    if (name === "traderId") {
      let trader = dataDf.tradersSelected.find((el) => el.id === val);
      if (transId) {
        trader.transId = transId;
      }
      let trans = listTransaction.find((el) => el.id === trader.transId);
      let tranId = trans.id;
      let ft = await getFTByTrader(val);
      let fishInPurchase = calculateData(trans.transactionDetails, ft);

      setCurrentTransaction((pre) => ({
        ...pre,
        ...trans,
        tranId,
        fishInPurchase,
      }));
    }
    setCurrentTransaction((pre) => ({ ...pre, [name]: val }));
  };

  async function getFTByTrader(traderId) {
    try {
      let param = traderId;

      if (date) {
        param += "/" + date;
      }
      setParam(param);
      let rs = await apis.getFTByTrader({}, "GET", param);
      if (rs && rs.statusCode === 200) {
        return rs.data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  function calculateData(arr, arrFish = []) {
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
    return arrFish.filter((fi) => fi.totalWeight > 0);
  }

  useEffect(() => {
    if (traderId || user.roleName === "Trader") {
      handleChangeTran("traderId", traderId || user.userID, transId);
    }

    return () => {
      setCurrentTransaction({
        fishInPurchase: [],
      });
      setRemain([]);
      setTotal({});
      setParam("");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderId]);

  return (
    <>
      {isShowCloseTransaction && (
        <Modal
          title={
            i18n.t("closeTransaction") +
            ": " +
            moment(currentTransaction.date).format("DD/MM/YYYY")
          }
          visible={isShowCloseTransaction}
          onOk={handleOk}
          onCancel={handleCancel}
          loading={loading}
          width={700}
          disabledOk={traderId || currentTransaction.status === "Completed"}
          titleBtnOk={i18n.t("closeTransaction")}
          component={() => (
            <Row>
              {/* FOR WEIGHT RECORDER: choose trader & input commison*/}
              {user && user.roleName !== "Trader" && (
                <>
                  <Col md="6">
                    <Widgets.Select
                      required={true}
                      label={i18n.t("trader")}
                      value={currentTransaction.traderId || ""}
                      onChange={(e) => handleChangeTran("traderId", e)}
                      items={dataDf.tradersSelected || []}
                      displayField={["firstName", "lastName"]}
                    />
                  </Col>
                  <Col md="6">
                    <Widgets.MoneyInput
                      placeholder="700"
                      disabled={
                        traderId || currentTransaction.status === "Completed"
                      }
                      required={true}
                      label={i18n.t("commissionWR")}
                      value={currentTransaction.commissionUnit || ""}
                      onChange={(val) =>
                        handleChangeTran("commissionUnit", val)
                      }
                    />
                  </Col>
                </>
              )}

              {/* FOR Trader */}
              {user.roleName === "Trader" && !traderId && (
                <RenderTB
                  transaction={listTransaction[listTransaction.length - 1]}
                  param={param}
                  isLast={true}
                  handleRemain={(ele) => {
                    setRemain(ele);
                  }}
                  traderId={traderId}
                  disabledBtn={currentTransaction.status === "Completed"}
                />
              )}

              {/* FOR BOTH ROLE */}
              {currentTransaction.fishInPurchase.length > 0 && (
                <Col md="12" className="mb-3">
                  {user.roleName === "Trader" &&
                    !currentTransaction.weightRecorder && <b>Cá tự bán:</b>}
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
                                value={total.totalAmount.toFixed(0)}
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

              {/* FOR Trader */}
              {user.roleName === "Trader" && !traderId && (
                <>
                  {listTransaction.map((el, idx) => (
                    <RenderTB
                      key={idx}
                      transaction={el}
                      param={param}
                      // isLast={idx === listTransaction.length - 1}
                      handleRemain={(ele) => {
                        setRemain(ele);
                      }}
                      traderId={traderId}
                      disabledBtn={currentTransaction.status === "Completed"}
                    />
                  ))}
                </>
              )}

              {/* FOR WEIGHT RECORDER */}
              {total &&
                total.totalAmount > 0 &&
                currentTransaction.commissionUnit > 0 && (
                  <>
                    <Col md="6">
                      <Widgets.NumberFormat
                        label={
                          i18n.t(
                            user.roleName === "Trader"
                              ? "moneyCommission"
                              : "wcReceiver"
                          ) + ": "
                        }
                        value={
                          total.totalWeight *
                            currentTransaction.commissionUnit || ""
                        }
                      />
                      {/* </Col>
                    <Col md="6"> */}
                      <Widgets.NumberFormat
                        label={
                          i18n.t(
                            user.roleName !== "Trader"
                              ? "payForTrader"
                              : "wcReceiver"
                          ) + ": "
                        }
                        value={
                          total.totalAmount -
                            total.totalWeight *
                              currentTransaction.commissionUnit || ""
                        }
                      />
                    </Col>
                  </>
                )}
            </Row>
          )}
        />
      )}
    </>
  );
};

export default ModalCloseSell;
const columns = [
  {
    title: "Tên cá",
    dataIndex: "fishName",
    key: "fishName",
  },
  {
    title: "Tổng khối lượng (Kg)",
    dataIndex: "totalWeight",
    key: "totalWeight",
    render: (weight) => (
      <Widgets.NumberFormat needSuffix={false} value={weight.toFixed(1)} />
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
      <Widgets.NumberFormat needSuffix={false} value={totalAmount.toFixed(0)} />
    ),
  },
];
