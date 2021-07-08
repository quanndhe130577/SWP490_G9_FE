import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";

const ModalEdit = ({ isShow, closeModal, mode, currentFT }) => {
  const [fishType, setFT] = useState(currentFT);

  const handleChangeFishType = (val, name) => {
    setFT((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const handleOk = async () => {
    try {
      let rs;
      if (mode === "create") {
        rs = await apis.createFT({
          ...fishType,
        });
      } else if (mode === "edit") {
        rs = await apis.updateFT(fishType);
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
  useEffect(() => {
    handleChangeFishType(new Date(), "date");
  }, [])
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
              label={i18n.t("Fish Name")}
              value={fishType.fishName || ""}
              onChange={(e) => handleChangeFishType(e, "fishName")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              label={i18n.t("Description")}
              value={fishType.description || ""}
              onChange={(e) => handleChangeFishType(e, "description")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.WeightInput
              type="number"
              label={i18n.t("Min Weight")}
              value={fishType.minWeight || ""}
              onChange={(e) => handleChangeFishType(e, "minWeight")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.WeightInput
              type="number"
              label={i18n.t("Max Weight")}
              value={fishType.maxWeight || ""}
              onChange={(e) => handleChangeFishType(e, "maxWeight")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.WeightInput
              type="number"
              label={i18n.t("Price")}
              value={fishType.price || ""}
              onChange={(e) => handleChangeFishType(e, "price")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              required={true}
              label={"Created Date"}
              value={fishType.date || new Date()}
              // maxDate={new Date()}
              // minDate={minDate}
              onChange={(data) => {
                //this.setState({ date: new Date(data) });
                handleChangeFishType(new Date(data), "date");
                //console.log(data);
              }}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
