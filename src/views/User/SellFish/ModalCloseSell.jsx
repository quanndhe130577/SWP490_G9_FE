import React, { useState } from "react";
import Modal from "../../../containers/Antd/ModalCustom";
import { Table } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import { apis, helper } from "../../../services";
import Moment from "react-moment";
import NumberFormat from "react-number-format";

const ModalCloseSell = ({
  isShowCloseTransaction,
  listTransaction,
  handleCloseModal,
  dataDf,
  handleCloseTrans,
  date,
}) => {
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [total, setTotal] = useState({});

  // transaction là 1 bản ghi của transaction
  const [loading, setLoading] = useState(false);

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
    if (!commissionUnit) {
      return "commissionUnitCanNull";
    } else if (listTranId.length <= 0) {
      return "traderUnitCanNull";
    }
  };
  const handleCancel = () => {
    handleCloseModal(!isShowCloseTransaction);
  };
  const handleChangeTran = async (name, val) => {
    if (name === "traderId") {
      let trader = dataDf.tradersSelected.find((el) => el.id === val);
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
        // ele.totalSellPrice = 0;
      }
      let tem = arr.filter((el) => el.fishType.id === ele.id);
      tem.forEach((el) => {
        ele.totalWeight += el.weight;
        ele.totalAmount += el.sellPrice * el.weight;
        // ele.totalSellPrice += el.sellPrice;
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

  return (
    <Modal
      title={i18n.t("closeTransaction")}
      visible={isShowCloseTransaction}
      onOk={handleOk}
      onCancel={handleCancel}
      loading={loading}
      width={800}
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
              required={true}
              label={i18n.t("commissionWR")}
              value={currentTransaction.commissionUnit || ""}
              onChange={(val) => handleChangeTran("commissionUnit", val)}
            />
          </Col>
          {currentTransaction.fishInPurchase && (
            <Col md="12">
              <Table
                columns={columns}
                dataSource={currentTransaction.fishInPurchase}
                bordered
                pagination={{ pageSize: 100 }}
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

          {total &&
            total.totalAmount > 0 &&
            currentTransaction.commissionUnit > 0 && (
              <>
                <Col md="6">
                  <Widgets.MoneyInput
                    disabled
                    placeholder="700"
                    label={i18n.t("wcTReciver")}
                    value={
                      total.totalWeight * currentTransaction.commissionUnit ||
                      ""
                    }
                    // onChange={(val) => handleChangeTran("commissionUnit", val)}
                  />
                </Col>
                <Col md="6">
                  <Widgets.MoneyInput
                    disabled
                    placeholder="700"
                    label={i18n.t("payForTrader")}
                    value={
                      total.totalAmount -
                        total.totalWeight * currentTransaction.commissionUnit ||
                      ""
                    }
                    // onChange={(val) => handleChangeTran("commissionUnit", val)}
                  />
                </Col>
              </>
            )}
        </Row>
      )}
    />
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
