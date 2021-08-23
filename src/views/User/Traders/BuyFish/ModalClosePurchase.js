import React, { useState, useEffect } from "react";
import { Table } from "antd";
import Modal from "../../../../containers/Antd/ModalCustom";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import { helper } from "../../../../services";

const ModalClosePurchase = ({
  isShowClosePurchase,
  purchase,
  prCurrentPurchase,
  handleShowClosePurchase,
  dataDf,
  handleClosePurchase,
  mode,
}) => {
  const [currentPurchase, setCurrentPurchase] = useState(prCurrentPurchase);
  const [objPurchase, setObjPurchase] = useState({
    fishInPurchase: [],
    totalWeight: 0,
  });

  // transaction là 1 bản ghi của purchase
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    let {
      pondOwnerName,
      totalAmount,
      totalWeight,
      sentMoney,
      commissionPercent,
    } = currentPurchase;
    const doAction = () => {
      helper
        .confirm(
          `<div class="row"><div class="col-md-12 mb-4" style = { textAlign: "center" }>Thông tin đơn mua</div><div class="col-md-5 t-left">Chủ ao:</div> <div class="col-md-7 t-left">${pondOwnerName}</div><div class="col-md-5 t-left">Khối lượng:</div><div class="col-md-7 t-left"> ${totalWeight} Kg</div><div class="col-md-5 t-left">Số tiền: </div><div class="col-md-7 t-left">${new Intl.NumberFormat().format(
            totalAmount * ((100 - commissionPercent) / 100)
          )} VND</div><div class="col-md-5 t-left">Số tiền đã trả: </div><div class="col-md-7 t-left">${new Intl.NumberFormat().format(
            sentMoney
          )} VND</div></div>`
        )
        .then((cf) => {
          if (cf) {
            setLoading(true);
            if (handleClosePurchase) {
              handleClosePurchase(currentPurchase);
              setLoading(false);
            }
          }
        });
    };
    if (sentMoney > totalAmount) {
      helper.confirm(i18n.t("cfOverSentMoney")).then((res) => {
        if (res) {
          doAction();
        }
      });
    } else {
      doAction();
    }
  };

  const handleCancel = () => {
    handleShowClosePurchase(!isShowClosePurchase);
  };

  const handlePurchase = (name, val) => {
    if (name === "commissionPercent") {
      val = parseInt(val);

      // let sentMoney = 0;
      // if (val) {
      //   let percent = (100 - val) / 100;
      //   sentMoney = currentPurchase.totalAmount * percent;
      // }
      // setCurrentPurchase((pre) => ({ ...pre, sentMoney }));
    } else if (name === "isPaid") {
      let { totalAmount, commissionPercent } = currentPurchase,
        sentMoney = 0;
      if (val && !sentMoney) {
        sentMoney = totalAmount * ((100 - commissionPercent) / 100);
      }
      setCurrentPurchase((pre) => ({ ...pre, sentMoney }));
    }
    setCurrentPurchase((pre) => ({ ...pre, [name]: val }));
  };

  const calculateData = () => {
    let totalWeight = 0,
      totalAmount = 0,
      fishInPurchase = [...currentPurchase.arrFish],
      tem = purchase;
    // clear total weight
    tem.forEach(({ fishType }) => {
      //  eslint-disable-next-line array-callback-return
      fishInPurchase.map((el) => {
        if (el.id === fishType.id) {
          el.totalWeight = 0;
        }
      });
    });

    tem.forEach(({ weight, price, fishType, basket }) => {
      totalWeight += weight;
      totalAmount += price;
      //  eslint-disable-next-line array-callback-return
      fishInPurchase.map((el) => {
        if (el.id === fishType.id) {
          if (el.totalWeight) {
            el.totalWeight += weight - basket.weight;
          } else {
            el.totalWeight = 0;
            el.totalWeight += weight - basket.weight;
          }
        }
      });
    });
    fishInPurchase = fishInPurchase.filter((el) => el.totalWeight > 0);
    if (mode === "view") {
      let { commission, totalAmount, sentMoney } = prCurrentPurchase;
      let commissionPercent = (commission / totalAmount) * 100;
      handlePurchase("commissionPercent", commissionPercent);
      handlePurchase("sentMoney", sentMoney);
    }
    setObjPurchase({
      totalWeight,
      totalAmount,
      fishInPurchase,
    });
  };

  useEffect(() => {
    calculateData();
    if (mode !== "view") {
      handlePurchase("commissionPercent", 0);
      handlePurchase("isPaid", false);
    }
    return () => {
      setCurrentPurchase({});
      setObjPurchase({ totalWeight: 0, totalAmount: 0, fishInPurchase: [] });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      title={i18n.t("closePurchase")}
      visible={isShowClosePurchase}
      onOk={handleOk}
      onCancel={handleCancel}
      loading={loading}
      disabledOk={currentPurchase.status === "Completed"}
      width={800}
      component={() => (
        <Row>
          <Col md="12">
            <label className="mr-2">
              <b>{i18n.t("date")}:</b>
              <Moment format="DD/MM/YYYY" className="ml-2">
                {currentPurchase.date}
              </Moment>
            </label>
          </Col>
          <Col md="4">
            <label>
              <b className="mr-2">{i18n.t("pondOwner")}:</b>
              {currentPurchase.pondOwnerName || ""}
            </label>
          </Col>
          <Col md="12" className="mb-3">
            <Table
              columns={columns}
              dataSource={objPurchase.fishInPurchase}
              bordered
              pagination={false}
              summary={(pageData) => {
                let allTotalWeight = 0,
                  totalAmount = 0;

                pageData.forEach(({ totalWeight, price }) => {
                  if (totalWeight) {
                    allTotalWeight += totalWeight;
                    totalAmount += price * totalWeight;
                  }
                });

                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        key="1"
                        colSpan="3"
                        className="bold text-center"
                      >
                        {i18n.t("total")}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell key="2" className="bold">
                        <NumberFormat
                          value={allTotalWeight.toFixed(1)}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix=" Kg"
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell key="3" className="bold">
                        <NumberFormat
                          value={totalAmount.toFixed(0)}
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

          <Col md="6">
            <Widgets.WeightInput
              label={i18n.t("percent") + " %"}
              value={currentPurchase.commissionPercent || ""}
              onChange={(val) => handlePurchase("commissionPercent", val)}
              isDisable={mode === "view"}
            />
            <Widgets.Checkbox
              label={i18n.t("payStatus")}
              value={currentPurchase.isPaid}
              onChange={(val) => handlePurchase("isPaid", val)}
              lblCheckbox={
                // currentPurchase.isPaid ? i18n.t("paid") : i18n.t("isNotPaid")
                i18n.t("paid")
              }
              disabled={mode === "view"}
              className=" mt-1 "
            />
          </Col>
          <Col md="6">
            <Widgets.NumberFormat
              label={i18n.t("percent") + ":"}
              value={
                (objPurchase.totalAmount * currentPurchase.commissionPercent) /
                  100 ||
                currentPurchase.commission ||
                ""
              }
              className=" mt-2 "
            />
            <Widgets.NumberFormat
              label={i18n.t("payForPondOwner") + ":  "}
              value={
                (objPurchase.totalAmount *
                  (100 - currentPurchase.commissionPercent)) /
                  100 ||
                currentPurchase.totalAmount - currentPurchase.commission ||
                ""
              }
            />

            <Widgets.MoneyInput
              label={mode === "view" ? "Số tiền đã trả: " : "Số tiền trả: "}
              value={currentPurchase.sentMoney || ""}
              onChange={(val) => handlePurchase("sentMoney", val)}
              disabled={mode === "view" || currentPurchase.isPaid}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalClosePurchase;
const columns = [
  {
    title: "STT",
    dataIndex: "idx",
    key: "idx",
    render: (text, row, idx) => <label>{idx + 1}</label>,
  },
  {
    title: "Tên cá",
    dataIndex: "fishName",
    key: "fishName",
  },
  {
    title: "Đơn giá (VND/Kg)",
    dataIndex: "price",
    key: "price",
    render: (price) => (
      <Widgets.NumberFormat needSuffix={false} value={price.toFixed(0)} />
    ),
  },
  {
    title: i18n.t("qtyOfFish(Kg-onlyFish)"),
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
        <label>({i18n.t("temporary")})</label>
      </div>
    ),
    dataIndex: "id",
    key: "id",
    render: (id, row) => (
      <Widgets.NumberFormat
        needSuffix={false}
        value={(row.price * parseFloat(row.totalWeight)).toFixed(0)}
      />
    ),
  },
];
