import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";

const ModalEdit = ({ isShow, closeModal, mode, user, trucks, currentDrum }) => {
  const [drum, setDrum] = useState(currentDrum || {});
  const [loading, setLoading] = useState(false);

  const handleChangeDrum = (val, name) => {
    setDrum((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const handleOk = async () => {
    try {
      let rs;
      setLoading(true);

      // validate truck, number: can't null
      if (!drum.truckId || !drum.number) {
        return helper.toast("error", i18n.t("fillAll*"));
      }

      if (mode === "create") {
        rs = await apis.createDrum(drum);
      } else if (mode === "edit") {
        rs = await apis.updateDrum(drum);
      }

      if (rs && rs.statusCode === 200) {
        closeModal(true);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      helper.toast("error", i18n.t("systemError"));
    } finally {
      setLoading(false);
    }
  };
  console.log(drum);

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
              label={i18n.t("numberDrum")}
              value={drum.number || ""}
              onChange={(e) => handleChangeDrum(e, "number")}
            />
          </Col>
          {/* <Col md="6" xs="12">
            <Widgets.Text
              label={i18n.t("type")}
              value={drum.type || ""}
              onChange={(e) => handleChangeDrum(e, "type")}
            />
          </Col> */}
          <Col md="6" xs="12">
            <Widgets.Select
              required={true}
              label={i18n.t("truck")}
              value={drum.truckId || ""}
              onChange={(e) => handleChangeDrum(e, "truckId")}
              items={trucks || []}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
