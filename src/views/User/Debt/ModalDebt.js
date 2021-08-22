import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../containers/Antd/ModalCustom";
import Widgets from "../../../schema/Widgets";
import helper from "../../../services/helper";
import i18n from "i18next";

const ModalEdit = ({ isShow, closeModal, currentDebt, updateDebt }) => {
  const [debtAmount, setDebtAmount] = useState(0);

  const handleOk = async () => {
    try {
      updateDebt(currentDebt.id, debtAmount);
    } catch (error) {
      helper.toast("error", i18n.t("systemError"));
    }
  };
  // useEffect(() => {
  //   handleChangeDebt(new Date(), "date");
  // }, []);

  return (
    <Modal
      title={"Chau len ba"}
      visible={isShow}
      onOk={handleOk}
      onCancel={closeModal}
      component={() => (
        <Row>
          <Col md="6" xs="12">
            <Widgets.MoneyInput
              label={"Số tiền trả thêm: "}
              value={debtAmount || ""}
              onChange={(e) => {
                setDebtAmount(e);
              }}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.MoneyInput
              label={"Cần phải trả: "}
              value={currentDebt.amount || ""}
              disabled={true}
            />
          </Col>
          {/* <Col md="6" xs="12">
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
          </Col> */}
        </Row>
      )}
    />
  );
};

export default ModalEdit;
