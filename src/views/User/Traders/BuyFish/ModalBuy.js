import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import "antd/dist/antd.css";

import Widgets from "../../../../schema/Widgets";
import helper from "../../../../services/helper";
import { difference } from "lodash";
// import apis from "../../../../services/helper";
// import data from "../../../../data";

const ModalBuy = ({
  isShowBuy,
  setIsShowBuy,
  currentPurchase,
  purchase,
  mode,
  dataDf,
  createPurchaseDetail,
  fetchDrumByTruck,
}) => {
  const [transaction, setTransaction] = useState(currentPurchase); // transaction là 1 bản ghi của purchase
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    if (createPurchaseDetail) {
      let validate = validateData();
      if (validate) {
        return helper.toast("error", i18n.t(validate));
      }
      let tem = transaction;
      tem.idx = purchase.length + 1;

      createPurchaseDetail(tem);
    }
    setIsShowBuy(false);
  };
  const handleCancel = () => {
    setIsShowBuy(false);
  };
  const handleChangeTran = async (name, value) => {
    // if(name === "drum"){
    //   let drums =purchase.drum
    //   drums
    // }
    // if (name === "weight") {
    //   value = parseInt(value);
    // } else
    if (name === "truck" && value !== transaction.truck) {
      // neu khac xe thi call api lấy lại list drum và set lại listDrumId
      let rs = await fetchDrumByTruck(value);
      setTransaction((prevState) => ({
        ...prevState,
        listDrumId: [],
      }));
      setLoading(rs);
    } else if (name === "listDrumId" && value.length > 0) {
      value = value.map((el) => (el = parseInt(el)));
    }
    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // validate các trường required
  const validateData = () => {
    let { weight, fishTypeId, truck, basketId } = transaction;
    if (!weight || !fishTypeId || !truck || !basketId) {
      return "fillAll*";
    } else {
      if (weight <= 0.1) {
        return "qtyMustLargerThan0";
      } else if (weight > 200) {
        setTransaction((prevState) => ({
          ...prevState,
          weight: 0,
        }));
        return "qtyMustSmallerThan200";
      }
    }
  };

  function changeKey(arr) {
    arr.forEach((el) => {
      helper.renameKey(el, "number", "name");
    });
    return arr;
  }
  async function convertDataInEditMode() {
    // data to display in create mode and edit mode is difference, we need convert data
    if (mode === "edit") {
      let fishTypeId = transaction.fishType.id;
      let basketId = transaction.basket.id;
      let truck = transaction.truck.id;
      let listDrumId = [];
      // get list drum id
      transaction.listDrum.forEach((el) => listDrumId.push(el.id || ""));
      setTransaction((prevState) => ({
        ...prevState,
        fishTypeId,
        basketId,
        truck,
        listDrumId,
      }));
      // fetch Drum By Truck
      let rs = await fetchDrumByTruck(truck);
      setLoading(rs);
    }
  }
  useEffect(() => {
    convertDataInEditMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      title={mode === "create" ? i18n.t("Thêm Mã") : ""}
      visible={isShowBuy}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row>
        <Col md="6" xs="12">
          <Widgets.Select
            required={true}
            label={i18n.t("typeOfFish")}
            value={transaction.fishTypeId || ""}
            onChange={(e) => handleChangeTran("fishTypeId", e)}
            items={currentPurchase.arrFish || dataDf.arrFish || []}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Number
            required={true}
            label={i18n.t("qtyOfFish(Kg)")}
            value={transaction.weight || 0}
            onChange={(e) => handleChangeTran("weight", e)}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Select
            required={true}
            label={i18n.t("basket")}
            value={transaction.basketId || ""}
            onChange={(e) => handleChangeTran("basketId", e)}
            items={dataDf.basket || []}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.Select
            required={true}
            label={i18n.t("truck")}
            value={transaction.truck || ""}
            onChange={(e) => handleChangeTran("truck", e)}
            items={dataDf.truck || []}
          />
        </Col>
        {transaction.truck && loading && (
          <Col md="6" xs="12">
            <Widgets.SelectSearchMulti
              // required={true}
              label={i18n.t("drum")}
              value={transaction.listDrumId || transaction.listDrum || []}
              onChange={(e) => handleChangeTran("listDrumId", e)}
              items={changeKey(dataDf.drum || [])}
            />
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default ModalBuy;
// const style = { background: "#0092ff", padding: "8px", margin: "5px" };
