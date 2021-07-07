import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";

const ModalEdit = ({ isShow, closeModal, mode, currentPO }) => {
  const [truck, setPO] = useState(currentPO);
  const [loading, setLoading] = useState(false);

  const handleChangePondOwner = (val, name) => {
    setPO((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const handleOk = async () => {
    try {
      setLoading(true);
      let rs;
      if (mode === "create") {
        rs = await apis.createTruck({
          licensePlate: truck.licensePlate,
          name: truck.name,
        });
      } else if (mode === "edit") {
        rs = await apis.updateTruck(truck);
      }

      if (rs && rs.statusCode === 200) {
        closeModal(true);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      helper.toast("error", i18n.t("systemError"));
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };
  console.log(truck);
  return (
    <Modal
      title={mode === "edit" ? i18n.t("edit") : i18n.t("create")}
      visible={isShow}
      onOk={handleOk}
      onCancel={closeModal}
      loading={loading}
      titleBtnOk={mode === "edit" ? i18n.t("edit") : i18n.t("create")}
      component={() => (
        <Row>
          <Col md="6" xs="12">
            <Widgets.Text
              required={true}
              label={i18n.t("licensePlate")}
              value={truck.licensePlate || ""}
              onChange={(e) => handleChangePondOwner(e, "licensePlate")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              required={true}
              label={i18n.t("name")}
              value={truck.name || ""}
              onChange={(e) => handleChangePondOwner(e, "name")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
