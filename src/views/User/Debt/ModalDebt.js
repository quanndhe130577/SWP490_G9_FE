import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../containers/Antd/ModalCustom";
import Widgets from "../../../schema/Widgets";
import helper from "../../../services/helper";
import i18n from "i18next";

const ModalEdit = ({
  isShow,
  closeModal,
  mode,
  currentDebt,
  testHanldeEdit,
}) => {
  const [debt, setDebt] = useState(currentDebt);

  const handleChangeDebt = (val, name) => {
    setDebt((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const handleOk = async () => {
    try {
      let rs;
      if (mode === "create") {
        // rs = await apis.createDebt({
        //   ...debt,
        // });
      } else if (mode === "edit") {
        // rs = await apis.updateDebt(debt);
        testHanldeEdit(debt);
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
    handleChangeDebt(new Date(), "date");
  }, []);

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
              label={i18n.t("Debtor Name")}
              value={debt.debtorname || ""}
              onChange={(e) => handleChangeDebt(e, "debtorname")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              label={i18n.t("Note")}
              value={debt.note || ""}
              onChange={(e) => handleChangeDebt(e, "note")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.WeightInput
              label={i18n.t("Money")}
              value={debt.money || ""}
              onChange={(e) => handleChangeDebt(e, "money")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              required={true}
              label={i18n.t("Created Date")}
              value={debt.createdDate || new Date()}
              onChange={(data) => {
                handleChangeDebt(new Date(data), "createdDate");
              }}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.DateTimePicker
              required={true}
              label={i18n.t("Deadline")}
              value={debt.deadline || new Date()}
              onChange={(data) => {
                handleChangeDebt(new Date(data), "deadline");
              }}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Checkbox
              label={i18n.t("Status")}
              lblCheckbox={i18n.t("isPaid")}
              value={debt.isPaid || false}
              onChange={(val) => handleChangeDebt(val, "isPaid")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
