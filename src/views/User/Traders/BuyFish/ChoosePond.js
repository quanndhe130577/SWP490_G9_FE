import React from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import data from "../../../../data";
import local from "../../../../services/local";

const ChoosePond = ({
  isShowChoosePond,
  setShowChoosePond,
  handleTotalBuy,
  pondOwner,
  currentPO,
}) => {
  const handleOk = () => {
    console.log("ok");
    setShowChoosePond(false);
  };
  const handleCancel = () => {
    onChange(currentPO, "pondOwner");
    setShowChoosePond(false);
  };
  const onChange = (val, prop) => {
    if (prop === "pondOwner") {
      local.set("currentPO", val);
      handleTotalBuy(val, "currentPO");
    }
    if (handleTotalBuy) {
      handleTotalBuy(val, prop);
    }
  };
  return (
    <Modal
      title={i18n.t("choosePond")}
      centered
      visible={isShowChoosePond}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
    >
      <Row>
        <Col md="6" xs="12">
          <Widgets.Select
            label={i18n.t("pondOwner")}
            value={pondOwner || currentPO}
            items={data.pondOwner}
            onChange={(vl) => onChange(vl, "pondOwner")}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ChoosePond;
