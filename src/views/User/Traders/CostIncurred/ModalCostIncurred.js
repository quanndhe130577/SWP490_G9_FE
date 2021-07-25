import i18n from "i18next";
import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import moment from "moment";

const ModalEdit = ({ isShow, closeModal, mode, currentCostInc }) => {
  const [costInc, setCostInc] = useState(currentCostInc);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    handleChangeCostIncurred(costInc ? costInc.date : new Date(), "date");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangeCostIncurred = (val, name) => {
    setCostInc((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      let user = session.get("user"),
        rs;
      // let valid = checkValidate(costInc.phoneNumber);
      // if (!valid.isValid) {
      //   helper.toast("error", valid.message);
      //   return;
      // }

      if (mode === "create") {
        rs = await apis.createCostIncurred({
          name: costInc.name,
          cost: costInc.cost,
          note: costInc.note,
          date: costInc.date,
          traderID: user.userID,
        });
      } else if (mode === "edit") {
        rs = await apis.updateCostIncurred(costInc);
      }

      if (rs && rs.statusCode === 200) {
        closeModal(true);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", i18n.t("systemError"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title={mode === "edit" ? i18n.t("edit") : i18n.t("create")}
      visible={isShow}
      onOk={handleOk}
      onCancel={closeModal}
      loading={loading}
      component={() => (
        <Row>
          <Col md="6" xs="12">
            <Widgets.Text
              required={true}
              label={i18n.t("name")}
              value={costInc.name || ""}
              onChange={(e) => handleChangeCostIncurred(e, "name")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.MoneyInput
              required={true}
              label={i18n.t("cost")}
              value={costInc.cost || ""}
              onChange={(e) => handleChangeCostIncurred(e, "cost")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              type="text"
              label={i18n.t("note")}
              value={costInc.note || ""}
              onChange={(e) => handleChangeCostIncurred(e, "note")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              type="date"
              label={i18n.t("date")}
              value={
                moment(costInc.date).format("DD/MM/YYYY") ||
                moment(new Date()).format("DD/MM/YYYY")
              }
              onChange={(e) => handleChangeCostIncurred(e, "date")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
