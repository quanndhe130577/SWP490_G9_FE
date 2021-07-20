import React, {useState} from "react";
import {Row, Col} from "reactstrap";
import {Checkbox} from "antd";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import moment from "moment";

const ModalEdit = ({isShow, closeModal, mode, currentPO, empId}) => {
  const [basket, setPO] = useState(currentPO);

  const handleChange = (val, name) => {
    setPO((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const handleOk = async () => {
    try {
      let rs;
      let date = moment()
      if (basket.date === undefined) {
        basket.date = date;
      }
      if (mode === "create") {
        rs = await apis.createAdvanceSalary({
          debt: basket.debt,
          date: basket.date._d,
          paid: true,
          empId: empId
        }, "POST");
      } else if (mode === "edit") {
        rs = await apis.updateAdvanceSalary(basket, "POST");
      }
      if (rs && rs.statusCode === 200) {
        closeModal(true);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      helper.toast("error", i18n.t("systemError"));
    }
  };
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
              label={i18n.t("debt")}
              value={basket.debt || ""}
              onChange={(e) => handleChange(e, "debt")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              type="date"
              label={i18n.t("date")}
              value={
                moment(basket.date).format("DD/MM/YYYY") ||
                moment(new Date()).format("DD/MM/YYYY")
              }
              onChange={(e) => handleChange(e, "date")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
