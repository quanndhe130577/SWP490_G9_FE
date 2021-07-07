import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";

const ModalEdit = ({ isShow, closeModal, mode, currentPO }) => {
  const [basket, setPO] = useState(currentPO);

  const handleChangePondOwner = (val, name) => {
    setPO((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const handleOk = async () => {
    try {
      // let user = session.get("user");
      let rs;
      if (mode === "create") {
        rs = await apis.createBasket({
          type: basket.type,
          weight: basket.weight,
        });
      } else if (mode === "edit") {
        rs = await apis.updateBasket(basket);
      }

      if (rs && rs.statusCode === 200) {
        closeModal(true);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", i18n.t("systemError"));
    }
  };
  console.log(basket);
  return (
    <Modal
      title={mode === "edit" ? i18n.t("edit") : i18n.t("create")}
      visible={isShow}
      onOk={handleOk}
      onCancel={closeModal}
      component={() => (
        <Row>
          <Col md="6" xs="12">
            <Widgets.Text
              required={true}
              label={i18n.t("type")}
              value={basket.type || ""}
              onChange={(e) => handleChangePondOwner(e, "type")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              required={true}
              label={i18n.t("weight")}
              type="number"
              value={basket.weight || ""}
              onChange={(e) => handleChangePondOwner(e, "weight")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
