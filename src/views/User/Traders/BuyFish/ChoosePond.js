import React from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
// import data from "../../../../data";
import local from "../../../../services/local";
import helper from "../../../../services/helper";
import PriceFishToday from "./PriceFishToday";
import { useHistory } from "react-router-dom";

const ChoosePond = ({
  isShowChoosePond,
  setShowChoosePond,
  // handlePurchase,
  pondOwner,
  currentPurchase,
  setCurrentPurchase,
  dataDf,
  createPurchase,
}) => {
  let history = useHistory();
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
      history.push("/home");
    } else {
      // if pondOwner null cant close modal
      let check = validate(currentPurchase, "pondOwner");
      if (!check) {
        onChange(currentPurchase.pondOwner, "pondOwner");
        setShowChoosePond(false);
      } else {
        helper.toast("error", i18n.t(check));
      }
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
      let tem = currentPurchase;
      if (prop === "pondOwner") {
        tem.pondOwner = val + "";
      } else {
        tem[prop] = val;
      }
      local.set("currentPurchase", tem);

      setCurrentPurchase(tem);
      // handlePurchase(val, prop);
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
            label={i18n.t("pondOwner")}
            value={parseInt(pondOwner || currentPurchase.pondOwner)}
            items={dataDf.pondOwner}
            onChange={(vl) => onChange(vl, "pondOwner")}
          />
          <Widgets.SelectSearchMulti
            label={i18n.t("chooseFish")}
            value={currentPurchase.listFish}
            items={addField(dataDf.fishType || [], "name", "fishName")}
            onChange={(vl) => onChange(vl, "listFish")}
          />
        </Col>
        <Col md="8" xs="12">
          <label className="bold">Các loại các trong ao</label>
          <PriceFishToday
            listFish={currentPurchase.listFish || []}
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
