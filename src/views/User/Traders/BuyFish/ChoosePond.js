import React from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import data from "../../../../data";
import local from "../../../../services/local";
import helper from "../../../../services/helper";
import PriceFishToday from "./PriceFishToday";

const ChoosePond = ({
  isShowChoosePond,
  setShowChoosePond,
  handleTotalBuy,
  pondOwner,
  currentTran,
  setCurrentTran,
}) => {
  const handleOk = () => {
    setShowChoosePond(false);
  };

  const handleCancel = () => {
    // if pondOwner null can close modal
    let check = validate(currentTran, "pondOwner");
    if (!check) {
      onChange(currentTran.pondOwner, "pondOwner");
      setShowChoosePond(false);
    } else {
      helper.toast("error", i18n.t(check));
    }
  };

  const validate = (obj, prop) => {
    // if pondOwner null return msg
    if (prop === "pondOwner" && !obj[prop]) {
      return "fillPondOwner";
    }
  };

  const onChange = (val, prop) => {
    // debugger;
    let tem = currentTran;
    if (prop === "pondOwner") {
      debugger;
      tem.pondOwner = val + "";
    } else {
      tem[prop] = val;
    }

    local.set("currentTran", tem);

    setCurrentTran(tem);
    handleTotalBuy(val, prop);
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
        <Col md="4" xs="12">
          <Widgets.Select
            label={i18n.t("pondOwner")}
            value={pondOwner || currentTran.pondOwner}
            items={data.pondOwner}
            onChange={(vl) => onChange(vl, "pondOwner")}
          />
          <Widgets.SelectSearchMulti
            label={i18n.t("chooseFish")}
            value={currentTran.listFish}
            items={data.fishType}
            onChange={(vl) => onChange(vl, "listFish")}
          />
        </Col>
        <Col md="8" xs="12">
          <label className="bold">Các loại các trong ao</label>
          <PriceFishToday
            listFish={currentTran.listFish || []}
            onChange={(arr) => onChange(arr, "arrFish")}
          />
        </Col>
        <Col md="4" xs="12" />
      </Row>
    </Modal>
  );
};

export default ChoosePond;
