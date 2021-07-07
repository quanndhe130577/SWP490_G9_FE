import React, { useState, useEffect } from "react";

import Modal from "../../../../containers/Antd/ModalCustom";

import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import helper from "../../../../services/helper";
// import { update } from "lodash";
// import apis from "../../../../services/helper";

const ModalBuy = ({
  isShowClosePurchase,
  purchase,
  prCurrentPurchase,
  handleClosePurchase,
}) => {
  const [currentPurchase, setCurrentPurchase] = useState(prCurrentPurchase);
  // transaction là 1 bản ghi của purchase
  const [loading, setLoading] = useState(false);

  const handleOk = () => {};

  const handleCancel = () => {
    handleClosePurchase(!isShowClosePurchase);
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
      component={() => <Row>closeModal</Row>}
    />
  );
};

export default ModalBuy;
// const style = { background: "#0092ff", padding: "8px", margin: "5px" };
