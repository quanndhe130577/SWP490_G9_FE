import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../../services/apis";
import helper from "../../../../../services/helper";
import session from "../../../../../services/session";
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

      if (mode === "edit") {
        rs = await apis.updateEmployee(employee);
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
            <Widgets.MoneyInput
              required={true}
              label={i18n.t("salary")}
              value={employee.salary}
              onChange={(e) => handleChangeEmployee(e, "salary")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
