import React, { useState, useEffect } from "react";
import Modal from "../../../containers/Antd/ModalCustom";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import Moment from "react-moment";

const ModalBuy = ({
  isShowClosePurchase,
  purchase,
  prCurrentPurchase,
  handleClosePurchase,
  dataDf,
}) => {
  const [currentPurchase, setCurrentPurchase] = useState(prCurrentPurchase);
  // transaction là 1 bản ghi của purchase
  const [loading, setLoading] = useState(false);

  const handleOk = () => {};

  const handleCancel = () => {
    handleClosePurchase(!isShowClosePurchase);
  };
  const handlePurchase = (name, val) => {
    setCurrentPurchase((pre) => ({ ...pre, [name]: val }));
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      title={i18n.t("closePurchase")}
      visible={isShowClosePurchase}
      onOk={handleOk}
      onCancel={handleCancel}
      loading={loading}
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
              label={i18n.t("percent")}
              value={currentPurchase.commission || ""}
              onChange={(val) => handlePurchase("commission", val)}
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
        </Row>
      )}
    />
  );
};

export default ModalBuy;
