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
  currentTotal,
  setCurrentTotal,
}) => {
  const handleOk = () => {
    setShowChoosePond(false);
  };

  const handleCancel = () => {
    // if pondOwner null can close modal
    let check = validate(currentTotal, "pondOwner");
    if (!check) {
      onChange(currentTotal.pondOwner, "pondOwner");
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
    if (!(prop === "arrFish" && val.length === 0)) {
      // debugger;
      let tem = currentTotal;
      if (prop === "pondOwner") {
        tem.pondOwner = val + "";
      } else {
        tem[prop] = val;
      }

      local.set("currentTotal", tem);

      setCurrentTotal(tem);
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
        <Col md="4" xs="12">
          <Widgets.Select
            label={i18n.t("pondOwner")}
            value={parseInt(pondOwner || currentTotal.pondOwner)}
            items={data.pondOwner}
            onChange={(vl) => onChange(vl, "pondOwner")}
          />
          <Widgets.SelectSearchMulti
            label={i18n.t("chooseFish")}
            value={currentTotal.listFish}
            items={data.fishType}
            onChange={(vl) => onChange(vl, "listFish")}
          />
        </Col>
        <Col md="8" xs="12">
          <label className="bold">Các loại các trong ao</label>
          <PriceFishToday
            listFish={currentTotal.listFish || []}
            onChange={(arr) => onChange(arr, "arrFish")}
          />
        </Col>
        <Col md="4" xs="12" />
      </Row>
    </Modal>
  );
};

export default ChoosePond;
