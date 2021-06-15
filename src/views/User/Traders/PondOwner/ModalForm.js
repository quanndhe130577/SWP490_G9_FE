import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { Modal } from "antd";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";

const ModalEdit = ({ isShow, closeModal, mode, currentPO }) => {
  const [pondOwner, setPO] = useState(currentPO);

  const handleChangePondOwner = (val, name) => {
    setPO((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const handleOk = async () => {
    try {
      let user = session.get("user");
      let rs = await apis.createPO({
        name: pondOwner.name,
        address: pondOwner.address,
        phoneNumber: pondOwner.phoneNumber,
        traderID: user.userID,
      });

      if (rs && rs.statusCode === 200) {
        closeModal(true);
        helper.toast("success", i18n.t(rs.message || "createSuccess"));
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", i18n.t("systemError"));
    }
  };
  return (
    <Modal
      title={mode === "edit" ? i18n.t("edit") : i18n.t("create")}
      visible={isShow}
      onOk={handleOk}
      onCancel={closeModal}
    >
      <Row>
        <Col md="6" xs="12">
          <Widgets.Text
            label={i18n.t("name")}
            value={pondOwner.name || ""}
            onChange={(e) => handleChangePondOwner(e, "name")}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Text
            label={i18n.t("address")}
            value={pondOwner.address || ""}
            onChange={(e) => handleChangePondOwner(e, "address")}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Text
            label={i18n.t("phone")}
            value={pondOwner.phoneNumber || ""}
            onChange={(e) => handleChangePondOwner(e, "phoneNumber")}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalEdit;
