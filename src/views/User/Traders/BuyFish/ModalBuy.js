import React, { useState } from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import "antd/dist/antd.css";
import Widgets from "../../../../schema/Widgets";
import helper from "../../../../services/helper"
// import data from "../../../../data";

const ModalBuy = ({
  isShowBuy,
  setIsShowBuy,
  currentTotal,
  transactions,
  handleTrans,
  currentTran,
  dataDf,
}) => {
  const [transaction, setTransaction] = useState(currentTran);

  const handleOk = () => {
    if (handleTrans) {
      let validate = validateDate()
      if (validate) {
        return helper.toast("error", i18n.t(validate))
      }
      let tem = transaction;
      tem.sid = transactions.length + 1;

      handleTrans(tem);
    }
    setIsShowBuy(false);
  };
  const handleCancel = () => {
    setIsShowBuy(false);
  };
  const handleChangeTran = (name, value) => {
    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const validateDate = () => {
    let { qtyOfFish, typeOfFish, truck, basket } = transaction;
    if (!qtyOfFish || !typeOfFish || !truck || !basket) {
      return "fillAll*"
    } else {
      if (qtyOfFish <= 0.1) {
        return "qtyMustLargerThan0"
      }
    }

  }
  return (
    <Modal
      title={i18n.t("Thêm Mã")}
      visible={isShowBuy}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row>
        <Col md="6" xs="12">
          <Widgets.Select
            required={true}
            label={i18n.t("typeOfFish")}
            value={transaction.typeOfFish || ""}
            onChange={(e) => handleChangeTran("typeOfFish", e)}
            items={currentTotal.arrFish || []}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Number
            required={true}
            label={i18n.t("qtyOfFish(Kg)")}
            type="number"
            value={transaction.qtyOfFish}
            onChange={(e) => handleChangeTran("qtyOfFish", e)}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Select
            required={true}
            label={i18n.t("basket")}
            value={transaction.basket || ""}
            onChange={(e) => handleChangeTran("basket", e)}
            items={dataDf.basket || []}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Select
            required={true}
            label={i18n.t("truck")}
            value={transaction.truck || ""}
            onChange={(e) => handleChangeTran("truck", e)}
            items={dataDf.truck || []}
          />
        </Col>
        {transaction.truck &&
          <Col md="6" xs="12">
            <Widgets.Select
              // required={true}
              label={i18n.t("drum")}
              value={transaction.drum || ""}
              onChange={(e) => handleChangeTran("drum", e)}
              items={dataDf.drum || []}
            />
          </Col>}


      </Row>
    </Modal>
  );
};

export default ModalBuy;
// const style = { background: "#0092ff", padding: "8px", margin: "5px" };
