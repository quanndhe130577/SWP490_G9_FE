import React, { useState, useEffect } from "react";
import { Table } from "antd";
import Modal from "../../../../containers/Antd/ModalCustom";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import Moment from "react-moment";

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
    setCurrentPurchase((pre) => ({ ...pre, [name]: val }));
  };
  const calculateData = () => {
    let totalWeight = 0,
      totalAmount = 0,
      fishInPurchase = [...currentPurchase.arrFish],
      tem = purchase;

    // clear total weight
    tem.forEach(({ fishType }) => {
      fishInPurchase.map((el) => {
        if (el.id === fishType.id) {
          el.totalWeight = 0;
        }
      });
    });

    tem.forEach(({ weight, price, fishType }) => {
      totalWeight += weight;
      totalAmount += price;
      fishInPurchase.map((el) => {
        if (el.id === fishType.id) {
          if (el.totalWeight) {
            el.totalWeight += weight;
          } else {
            el.totalWeight = 0;
            el.totalWeight += weight;
          }
        }
      });
    });
    setObjPurchase({
      totalWeight,
      totalAmount,
      fishInPurchase,
    });
    // setFishInPurchase(fishInPurchase);
  };
  useEffect(() => {
    calculateData();
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
          <Col md="6">
            <Widgets.Select
              label={i18n.t("pondOwner")}
              value={parseInt(currentPurchase.pondOwner)}
              items={dataDf.pondOwner}
              isDisable={currentPurchase.pondOwner ? true : false}
            />
          </Col>
          <Col md="6">
            <Widgets.Number
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
                currentPurchase.isPaid ? i18n.t("paid") : i18n.t("hasn'tPaid")
              }
            />
          </Col>
          <Col md="6">
            <Widgets.Number
              label={i18n.t("totalAmount")}
              value={objPurchase.totalAmount || ""}
              // onChange={(val) => handlePurchase("commission", val)}
            />
          </Col>
          <Col md="6">
            <Widgets.Number
              label={i18n.t("totalWeight")}
              value={objPurchase.totalWeight.toFixed(1) || ""}
            />
          </Col>
          <Col md="12">
            <Table
              columns={columns}
              dataSource={objPurchase.fishInPurchase}
              bordered
            />
          </Col>
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
    title: "Giá (VND/kg)",
    dataIndex: "price",
    key: "price",
    render: (price) => <Widgets.NumberFormat value={price} />,
  },
  {
    title: "Tổng khối lượng",
    dataIndex: "totalWeight",
    key: "totalWeight",
  },
];
