import React, { useState, useEffect } from "react";
import Modal from "../../../containers/Antd/ModalCustom";
import { Table } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import { apis, helper, session } from "../../../services";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import RenderTB from "./RenderTB";
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
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [total, setTotal] = useState({});
  const [loading, setLoading] = useState(false);
  const [param, setParam] = useState("");
  const user = session.get("user");

  const handleOk = () => {
    try {
      setLoading(true);
      let check = validate();
      if (!check) {
        let { commissionUnit, listTranId } = currentTransaction;

        if (handleCloseTrans) {
          handleCloseTrans({ commissionUnit, listTranId });
        }
      } else {
        helper.toast("error", i18n.t(check));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let { commissionUnit, listTranId } = currentTransaction;
    if (!commissionUnit && user.roleName !== "Trader") {
      return "commissionUnitCanNull";
    } else if (listTranId.length <= 0) {
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
      let listTranId = [trans.id];
      let ft = await getFTByTrader(val);
      let fishInPurchase = calculateData(trans.transactionDetails, ft);

      setCurrentTransaction((pre) => ({
        ...pre,
        ...trans,
        listTranId,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderId]);

  return (
    <>
      {isShowCloseTransaction && (
        <Modal
          title={i18n.t("closeTransaction")}
          visible={isShowCloseTransaction}
          onOk={handleOk}
          onCancel={handleCancel}
          loading={loading}
          width={800}
          disabledOk={traderId || currentTransaction.status === "Completed"}
          component={() => (
            <Row>
              <Col md="12">
                <label className="mr-2">
                  <b>{i18n.t("date")}:</b>
                  <Moment format="DD/MM/YYYY" className="ml-2">
                    {currentTransaction && currentTransaction.date}
                  </Moment>
                </label>
              </Col>

              {/* FOR WEIGHT RECORDER */}
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
                      disabled={traderId}
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

              {/* FOR BOTH ROLE */}
              {currentTransaction.fishInPurchase && (
                <Col md="12" className="mb-3">
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
              )}

              {/* FOR Trader */}
              {user && user.roleName === "Trader" && (
                <>
                  {listTransaction.map(
                    (el) =>
                      el.weightRecorder && (
                        <RenderTB transaction={el} param={param} />
                      )
                  )}
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
                    </Col>
                    <Col md="6">
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
