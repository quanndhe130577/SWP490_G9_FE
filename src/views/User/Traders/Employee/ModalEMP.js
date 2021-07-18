import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import moment from "moment";

const ModalEdit = ({ isShow, closeModal, mode, currentEmp }) => {
  const [employee, setEmp] = useState(currentEmp);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    handleChangeEmployee(new Date(), "dob");
  }, []);
  const handleChangeEmployee = (val, name) => {
    setEmp((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const checkValidate = (data) => {
    const phoneNumberVNRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneNumberVNRegex.test(data)) {
      return { isValid: false, message: "Số điện thoại không đúng" };
    }
    return { isValid: true, message: "" };
  };
  const handleOk = async () => {
    try {
      setLoading(true);
      let user = session.get("user"),
        rs;
      let valid = checkValidate(employee.phoneNumber);
      if (!valid.isValid) {
        helper.toast("error", valid.message);
        return;
      }

      if (mode === "create") {
        rs = await apis.createEmployee({
          name: employee.name,
          address: employee.address,
          phoneNumber: employee.phoneNumber,
          dob: employee.dob,
          traderID: user.userID,
        });
      } else if (mode === "edit") {
        rs = await apis.updateEmployee(employee);
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
              value={employee.name || ""}
              onChange={(e) => handleChangeEmployee(e, "name")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              label={i18n.t("address")}
              value={employee.address || ""}
              onChange={(e) => handleChangeEmployee(e, "address")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Phone
              required={true}
              type="text"
              label={i18n.t("phone")}
              value={employee.phoneNumber || ""}
              onChange={(e) => handleChangeEmployee(e, "phoneNumber")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              type="date"
              label={i18n.t("dob")}
              value={
                moment(employee.dob).format("DD/MM/YYYY") ||
                moment(new Date()).format("DD/MM/YYYY")
              }
              onChange={(e) => handleChangeEmployee(e, "dob")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              required={true}
              type="date"
              label={i18n.t("startDate")}
              value={
                moment(employee.startDate).format("DD/MM/YYYY") ||
                moment(new Date()).format("DD/MM/YYYY")
              }
              onChange={(e) => handleChangeEmployee(e, "startDate")}
            />
          </Col>
          {/* {mode === "edit" && (
            <Col md="6" xs="12">
              <Widgets.DateTimePicker
                type="date"
                label={i18n.t("endDate")}
                value={moment(employee.endDate || new Date()).format("DD/MM/YYYY")}
                onChange={(e) => handleChangeEmployee(e, "endDate")}
              />
            </Col>
          )} */}
        </Row>
      )}
    />
  );
};

export default ModalEdit;
