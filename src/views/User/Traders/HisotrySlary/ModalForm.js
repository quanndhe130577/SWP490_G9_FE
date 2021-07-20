import React, {useState} from "react";
import {Row, Col} from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import moment from "moment";

const ModalEdit = ({isShow, closeModal, mode, currentPO, empId}) => {
  // basket.startdate=basket.startdate?basket.startdate:moment()
  // basket.enddate=basket.enddate?basket.enddate:moment()
  const [basket, setPO] = useState(currentPO);

  const handleChange = (val, name) => {
    setPO((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const handleOk = async () => {
    try {
      let date = moment()
      if (basket.startdate === undefined) {
        basket.startdate = date._d;
      }
      if (basket.enddate === undefined) {
        basket.enddate = date._d;
      }
      let rs;
      if (mode === "create") {
        rs = await apis.createEmpSalary({
          salary: basket.salary,
          startdate: basket.startdate,
          enddate: basket.enddate,
        }, "POST", empId);
      } else if (mode === "edit") {
        rs = await apis.updateEmpSalary(basket, "POST", empId);
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
              label={i18n.t("salary")}
              value={basket.salary || ""}
              onChange={(e) => handleChange(e, "salary")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              type="date"
              label={i18n.t("startdate")}
              value={
                moment(basket.startdate).format("DD/MM/YYYY") ||
                moment(new Date()).format("DD/MM/YYYY")
              }
              onChange={(e) => handleChange(e, "startdate")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              type="date"
              label={i18n.t("enddate")}
              value={
                moment(basket.enddate).format("DD/MM/YYYY") ||
                moment(new Date()).format("DD/MM/YYYY")
              }
              onChange={(e) => handleChange(e, "enddate")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
