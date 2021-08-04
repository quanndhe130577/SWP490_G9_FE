import React, { useState, useEffect } from "react";
import { Table } from "antd";
import Modal from "../../../../containers/Antd/ModalCustom";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import Moment from "react-moment";
import NumberFormat from "react-number-format";

const ModalBuy = ({
  isShowClosePurchase,
  purchase,
  prCurrentPurchase,
  handleShowClosePurchase,
  dataDf,
  handleClosePurchase,
}) => {
  const [currentPurchase, setCurrentPurchase] = useState(prCurrentPurchase);
  // const [fishInPurchase, setFishInPurchase] = useState([]);
  const [objPurchase, setObjPurchase] = useState({
    fishInPurchase: [],
    totalWeight: 0,
  });

  // transaction là 1 bản ghi của purchase
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    if (handleClosePurchase) {
      handleClosePurchase(currentPurchase);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    handleShowClosePurchase(!isShowClosePurchase);
  };

  const handlePurchase = (name, val) => {
    if (name === "commissionPercent") {
      val = parseInt(val);
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
    console.log("totalAmount" + totalAmount);
    setObjPurchase({
      totalWeight,
      totalAmount,
      fishInPurchase,
    });
    // setFishInPurchase(fishInPurchase);
  };

  useEffect(() => {
    calculateData();
    handlePurchase("commissionPercent", 0);
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
            {/* <Widgets.Select
              label={i18n.t("pondOwner") + ": "}
              value={parseInt(currentPurchase.pondOwnerId)}
              items={dataDf.pondOwner}
              isDisable={currentPurchase.pondOwnerId ? true : false}
              displayField="name"
              saveField="id"
              width={"75%"}
            /> */}
            <label>
              <b className="mr-2">{i18n.t("pondOwner")}:</b>
              {currentPurchase.pondOwnerName || ""}
            </label>
          </Col>
          <Col md="12">
            <Table
              columns={columns}
              dataSource={objPurchase.fishInPurchase}
              bordered
              pagination={{ pageSize: 100 }}
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
                      <Table.Summary.Cell key="1" colSpan="2" className="bold">
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
                          value={totalAmount}
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
            />
          </Col>
          <Col md="6">
            <Widgets.Checkbox
              label={i18n.t("payStatus")}
              value={currentPurchase.isPaid}
              onChange={(val) => handlePurchase("isPaid", val)}
              lblCheckbox={
                currentPurchase.isPaid ? i18n.t("paid") : i18n.t("isNotPaid")
              }
            />
          </Col>
          <Col md="6">
            <Widgets.NumberFormat
              label={i18n.t("percent") + ":"}
              value={
                (objPurchase.totalAmount * currentPurchase.commissionPercent) /
                  100 || ""
              }
            />
            <Widgets.NumberFormat
              label={i18n.t("payForPondOwner") + ":  "}
              value={
                (objPurchase.totalAmount *
                  (100 - currentPurchase.commissionPercent)) /
                  100 || ""
              }
            />
          </Col>
          {/* <Col md="6">
            <Widgets.WeightInput
              label={i18n.t("totalWeight")}
              value={objPurchase.totalWeight.toFixed(1) || ""}
            />
          </Col> */}
        </Row>
      )}
    />
  );
};

export default ModalBuy;
const columns = [
  // {
  //   title: "STT",
  //   dataIndex: "idx",
  //   key: "idx",
  //   render: (text) => <label>{text}</label>,
  // },
  {
    title: "Tên cá",
    dataIndex: "fishName",
    key: "fishName",
  },
  {
    title: "Đơn giá (VND/kg)",
    dataIndex: "price",
    key: "price",
    render: (price) => (
      <Widgets.NumberFormat needSuffix={false} value={price} />
    ),
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
        <label>({i18n.t("temporary")})</label>
      </div>
    ),
    dataIndex: "id",
    key: "id",
    render: (id, row) => (
      <Widgets.NumberFormat
        needSuffix={false}
        value={row.price * parseFloat(row.totalWeight)}
      />
    ),
  },
];
