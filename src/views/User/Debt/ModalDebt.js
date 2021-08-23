import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../containers/Antd/ModalCustom";
import Widgets from "../../../schema/Widgets";
import helper from "../../../services/helper";
import i18n from "i18next";

const ModalEdit = ({ isShow, closeModal, currentDebt, updateDebt }) => {
  const [debtAmount, setDebtAmount] = useState(0);

  const handleOk = async () => {
    try {
      updateDebt(currentDebt.id || currentDebt.transID, debtAmount);
      setDebtAmount(0);
    } catch (error) {
      helper.toast("error", i18n.t("systemError"));
    }
  };

  return (
    <Modal
      title={"Trả nợ"}
      visible={isShow}
      onOk={handleOk}
      onCancel={closeModal}
      component={() => (
        <Row>
          <Col md="6" xs="12">
            <Widgets.MoneyInput
              label={"Cần phải trả: "}
              value={currentDebt.amount || ""}
              disabled={true}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.MoneyInput
              label={"Số tiền trả thêm: "}
              value={debtAmount || 0}
              onChange={(e) => {
                setDebtAmount(e);
              }}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalEdit;
