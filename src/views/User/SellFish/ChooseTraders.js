import React from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import local from "../../../services/local";
import helper from "../../../services/helper";
import PriceFishToday from "./PriceFishToday";

const ChoosePond = ({
  isShowChoosePond,
  setShowChoosePond,
  trader,
  currentPurchase,
  setCurrentPurchase,
  dataDf,
  createPurchase,
}) => {
  let isChange = false;

  const handleOk = () => {
    setShowChoosePond(false);
    // neu ko co id purchase thì tạo purchase mới
    if (createPurchase && !currentPurchase.id) {
      createPurchase();
    }
  };

  const handleCancel = () => {
    if (!isChange) {
      // history.push("/home");
      setShowChoosePond(false);
    } else {
      // if trader null cant close modal
      let check = validate(currentPurchase, "trader");
      if (!check) {
        onChange(currentPurchase.trader, "trader");
        setShowChoosePond(false);
      } else {
        helper.toast("error", i18n.t(check));
      }
    }
  };

  const validate = (obj, prop) => {
    // if trader null return msg
    if (prop === "trader" && !obj[prop]) {
      return "filltrader";
    }
  };

  const onChange = (val, prop) => {
    if (!(prop === "arrFish" && val.length === 0)) {
      let tem = currentPurchase;
      if (prop === "trader") {
        tem.trader = val + "";
      } else {
        tem[prop] = val;
      }

      local.set("currentPurchase", tem);
      setCurrentPurchase((prevState) => ({
        ...prevState,
        [prop]: val,
      }));
    }
  };
  function addField(arr, newField, oldField) {
    arr.map((el) => (el[newField] = el[oldField]));
    return arr;
  }

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
            label={i18n.t("trader")}
            value={parseInt(trader || currentPurchase.trader)}
            items={dataDf.trader}
            isDisable={currentPurchase.trader ? true : false}
            onChange={(vl) => onChange(vl, "trader")}
          />
          <Widgets.SelectSearchMulti
            label={i18n.t("chooseFish")}
            value={currentPurchase.listFishId}
            items={addField(dataDf.fishType || [], "name", "fishName")}
            onChange={(vl) => onChange(vl, "listFishId")}
          />
        </Col>
        <Col md="8" xs="12">
          <label className="bold">{i18n.t("fishesInPond")}</label>
          <PriceFishToday
            listFishId={currentPurchase.listFishId || []}
            onChange={(arr) => onChange(arr, "arrFish")}
            dataDf={dataDf}
          />
        </Col>
        <Col md="4" xs="12" />
      </Row>
    </Modal>
  );
};

export default ChoosePond;
