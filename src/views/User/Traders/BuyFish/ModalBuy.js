import React, { useState } from "react";
import { Modal, Button } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import "antd/dist/antd.css";
import Widgets from "../../../../schema/Widgets";

const ModalBuy = ({ isModalVisible, handleCancel, handleOk }) => {
  const [transaction, setTransaction] = useState({});
  const handleChangeTran = (name, value) => {
    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <Modal
      title={i18n.t("Thêm Mã")}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row>
        {/* <Col md="6" xs="12">
          <Widgets.Text
            required={true}
            label={i18n.t("buyer")}
            value={transaction.buyer}
            onChange={(e) => handleChangeTran("buyer", e)}
          />
        </Col> */}
        <Col md="6" xs="12">
          <Widgets.Text
            required={true}
            label={i18n.t("typeOfFish")}
            value={transaction.type}
            onChange={(e) => handleChangeTran("type", e)}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Text
            required={true}
            label={i18n.t("qtyOfFish")}
            value={transaction.type}
            onChange={(e) => handleChangeTran("qtyOfFish", e)}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Text
            required={true}
            label={i18n.t("basket")}
            value={transaction.basket}
            onChange={(e) => handleChangeTran("basket", e)}
          />
        </Col>
        {/* <Col md="6" xs="12">
          <Widgets.Text
            required={true}
            label={i18n.t("seller")}
            value={transaction.seller}
            onChange={(e) => handleChangeTran("seller", e)}
          />
        </Col> */}
        {/* <Col md="6" xs="12">
          <Widgets.Text
            required={true}
            label={i18n.t("sellPrice")}
            value={transaction.sellPrice}
            onChange={(e) => handleChangeTran("sellPrice", e)}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Text
            required={true}
            label={i18n.t("seller")}
            value={transaction.seller}
            onChange={(e) => handleChangeTran("seller", e)}
          />
        </Col> */}
      </Row>
    </Modal>
  );
};

export default ModalBuy;
const style = { background: "#0092ff", padding: "8px", margin: "5px" };
