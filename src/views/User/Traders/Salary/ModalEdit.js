import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import moment from "moment";

const ModalEdit = ({ isShow, closeModal, mode, currentEmp, name }) => {
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
  let rs;
  const handleOk = async () => {
    try {
      setLoading(true);
      if (mode === "edit") {
        rs = await apis.updateEmployeeBaseSalary({ salary: employee.baseSalary, empId: employee.id });
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
      title={i18n.t("edit")}
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
              value={employee.baseSalary}
              defaultValue={employee.baseSalary}
              onChange={(e) => handleChangeEmployee(e, "baseSalary")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
