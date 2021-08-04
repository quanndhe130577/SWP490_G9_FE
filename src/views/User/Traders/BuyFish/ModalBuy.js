import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import helper from "../../../../services/helper";

const ModalBuy = ({
  isShowBuy,
  setIsShowBuy,
  currentPurchase,
  purchase,
  mode,
  dataDf,
  createPurchaseDetail,
  fetchDrumByTruck,
  updatePurchaseDetail,
  suggestionPurchase,
}) => {
  const [transaction, setTransaction] = useState(currentPurchase); // transaction là 1 bản ghi của purchase
  const [loading, setLoading] = useState(false);
  const handleOk = () => {
    let validate = validateData();
    if (validate) {
      return helper.toast("error", i18n.t(validate));
    }
    let tem = transaction;
    if (mode === "create") {
      if (createPurchaseDetail) {
        tem.idx = purchase.length + 1;
        createPurchaseDetail(tem);
      }
      //setIsShowBuy(false);
    } else if (mode === "edit") {
      updatePurchaseDetail(transaction);
    }
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
      //value = value.map((el) => (el = parseInt(el)));
      value = value.map((el) => (el = "" + el));
    }
    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // validate các trường required
  const validateData = () => {
    let { weight, fishTypeId, truck, basketId, listDrumId } = transaction;
    if (
      !weight ||
      !fishTypeId ||
      !truck ||
      !basketId ||
      listDrumId.length <= 0
    ) {
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

  // function changeKey(arr) {
  //   arr.forEach((el) => {
  //     helper.renameKey(el, "number", "name");
  //   });
  //   return arr;
  // }
  async function convertDataInEditMode() {
    if (mode === "create") {
      if (suggestionPurchase) {
        // purchase goi y khi mua
        let fishTypeId = suggestionPurchase.fishTypeId;
        let basketId = suggestionPurchase.basketId;
        let truck = suggestionPurchase.truck;
        let listDrumId = [...suggestionPurchase.listDrumId];

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
        //setLoading(true);
      } else {
        setTransaction((prevState) => ({
          ...prevState,
          weight: 0,
        }));
      }
    }
    // data to display in create mode and edit mode is difference, we need convert data
    else if (mode === "edit") {
      let fishTypeId = transaction.fishType.id;
      let basketId = transaction.basket.id;
      let truck = transaction.truck.id;
      let listDrumId = [];
      // get list drum id
      transaction.listDrum.forEach((el) => listDrumId.push("" + el.id || ""));
      setTransaction((prevState) => ({
        ...prevState,
        fishTypeId,
        basketId,
        truck,
        listDrumId,
      }));
      // // fetch Drum By Truck
      let rs = await fetchDrumByTruck(truck);
      setLoading(rs);
      //setLoading(true);
    }
  }
  useEffect(() => {
    convertDataInEditMode();
    return () => {
      setTransaction({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      title={
        mode === "create"
          ? i18n.t("createPurchaseDetail")
          : i18n.t("editPurchaseDetail")
      }
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
            displayField="fishName"
            saveField="id"
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.WeightInput
            required={true}
            label={i18n.t("qtyOfFish(Kg)")}
            value={transaction.weight || ""}
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
            displayField={["type", "weight"]}
            containLbl={containLbl}
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
              required={true}
              label={i18n.t("drum")}
              value={transaction.listDrumId || []}
              //value={transaction.listDrumId || transaction.listDrum || []}
              onChange={(e) => handleChangeTran("listDrumId", e)}
              items={dataDf.drum || []}
              displayField="number"
              saveField="id"
            />
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default ModalBuy;
const containLbl = {
  text: "",
  field: "weight",
  suffix: " Kg",
};
