import React from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import PriceFishToday from "./PriceFishToday";
import services from "../../../../services";
import { useHistory } from "react-router-dom";
import { useState } from "react";

const { local, helper } = services;
const ChoosePond = ({
  isShowChoosePond,
  setShowChoosePond,
  pondOwner,
  currentPurchase,
  setCurrentPurchase,
  dataDf,
  createPurchase,
  updateAllFishType,
}) => {
  let isChange = false;
  const history = useHistory();

  const [dataChange, setDataChange] = useState([]);
  const handleOk = async () => {
    setShowChoosePond(false);
    //updateAllFishType
    console.log(dataChange);
    // neu ko co id purchase thì tạo purchase mới
    if (createPurchase && !currentPurchase.id) {
      let purchase = await createPurchase();
      updateAllFishType(
        { purchaseId: purchase.id, listFishType: dataChange },
        purchase
      );
    }
  };

  const handleCancel = () => {
    if (currentPurchase && currentPurchase.id && !isChange) {
      setShowChoosePond(false);
    } else if (!isChange) {
      history.push("/buy");
      setShowChoosePond(false);
    } else {
      // if pondOwner null cant close modal
      let check = validate(currentPurchase, "pondOwnerId");
      if (!check) {
        onChange(currentPurchase.pondOwner, "pondOwnerId");
        setShowChoosePond(false);
      } else {
        helper.toast("error", i18n.t(check));
      }
    }
  };

  const validate = (obj, prop) => {
    // if pondOwner null return msg
    if (prop === "pondOwnerId" && !obj[prop]) {
      return "fillPondOwner";
    }
  };

  const onChange = (val, prop) => {
    if (!(prop === "arrFish" && val.length === 0)) {
      let tem = currentPurchase;
      if (prop === "pondOwnerId") {
        tem.pondOwner = val + "";
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
            value={parseInt(pondOwner || currentPurchase.pondOwnerId)}
            items={dataDf.pondOwner}
            // isDisable={currentPurchase.pondOwner ? true : false}
            onChange={(vl) => onChange(vl, "pondOwnerId")}
          />
          <Widgets.SelectSearchMulti
            label={i18n.t("chooseFish")}
            value={currentPurchase.listFishId}
            items={dataDf.fishType}
            displayField="fishName"
            saveField="id"
            onChange={(vl) => onChange(vl, "listFishId")}
          />
        </Col>
        <Col md="8" xs="12">
          <label className="bold">{i18n.t("fishesInPond")}</label>
          <PriceFishToday
            listFishId={currentPurchase.listFishId || []}
            onChange={(arr) => onChange(arr, "arrFish")}
            dataDf={dataDf}
            dataChange={(data) => setDataChange(data)}
          />
        </Col>
        <Col md="4" xs="12" />
      </Row>
    </Modal>
  );
};

export default ChoosePond;
