import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import helper from "../../../services/helper";
import { apis, local } from "../../../services";
import { API_FETCH } from "../../../constant";

const ModalSell = ({
  isShowSell,
  setShowSell,
  currentTransaction,
  Trans,
  mode,
  dataDf,
  createTransDetail,
  updateTransDetail,
  suggestionTrans,
}) => {
  const [transaction, setTransaction] = useState(currentTransaction); // transaction là 1 bản ghi của Trans
  // const [loading, setLoading] = useState(false);

  const handleOk = () => {
    let validate = validateData();
    if (validate) {
      return helper.toast("error", i18n.t(validate));
    }
    let tem = transaction;
    if (mode === "create") {
      if (createTransDetail) {
        tem.idx = Trans.length + 1;
        createTransDetail(tem);
      }
      setShowSell(false);
    } else if (mode === "edit") {
      updateTransDetail(transaction);
    }
  };
  const handleCancel = () => {
    setShowSell(false);
  };
  const handleChangeTran = async (name, value) => {
    if (name === "isRetailCustomers" && !value) {
      setTransaction((prevState) => ({
        ...prevState,
        buyer: "",
        isPaid: true,
      }));
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
    } else if (mode === "create" && suggestionTrans) {
      // Trans goi y khi mua
      let fishTypeId = suggestionTrans.fishTypeId;
      let basketId = suggestionTrans.basketId;
      let truck = suggestionTrans.truck;
      let listDrumId = suggestionTrans.listDrumId;

      setTransaction((prevState) => ({
        ...prevState,
        fishTypeId,
        basketId,
        truck,
        listDrumId,
      }));
    }
  }
  async function getBuyer() {
    try {
      let buyer = local.get("buyer");
      if (!buyer) {
        let rs = await apis.getBuyers({}, "GET");
        if (rs && rs.statusCode === 200) {
          buyer = rs.data;
        }
      }
      setTransaction((pre) => ({ ...pre, listBuyer: buyer }));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    convertDataInEditMode();
    getBuyer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      title={
        mode === "create"
          ? i18n.t("createTransDetail")
          : i18n.t("editTransDetail")
      }
      visible={isShowSell}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
    >
      <Row>
        <Col md="6" xs="12">
          <Widgets.Select
            required={true}
            label={i18n.t("trader")}
            value={transaction.trader || ""}
            onChange={(e) => handleChangeTran("trader", e)}
            items={dataDf.trader || []}
          />
        </Col>

        <Col md="4" xs="12">
          <Widgets.SearchFetchApi
            required={true}
            label={i18n.t("buyer")}
            value={transaction.buyer || []}
            onSelect={(e) => handleChangeTran("buyer", e)}
            items={transaction.listBuyer || []}
            api={API_FETCH.API_FIND_BUYER}
            placeholder={i18n.t("enterNameToFindBuyer")}
            disabled={transaction.isRetailCustomers || false}
          />
        </Col>

        <Col md="2" xs="12">
          <Widgets.Checkbox
            label={i18n.t("Or")}
            value={transaction.isRetailCustomers || false}
            onChange={(e) => handleChangeTran("isRetailCustomers", e)}
            lblCheckbox={i18n.t("retailCustomers")}
          />
        </Col>

        <Col md="6" xs="12">
          <Widgets.Select
            required={true}
            label={i18n.t("typeOfFish")}
            value={transaction.fishTypeId || ""}
            onChange={(e) => handleChangeTran("fishTypeId", e)}
            items={currentTransaction.arrFish || dataDf.arrFish || []}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.WeightInput
            required={true}
            label={i18n.t("qtyOfFish(Kg)")}
            value={transaction.weight || 0}
            onChange={(e) => handleChangeTran("weight", e)}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.MoneyInput
            required={true}
            label={i18n.t("sellPrice")}
            value={transaction.cost || ""}
            onChange={(e) => handleChangeTran("cost", e)}
          />
        </Col>
        <Col md="2" xs="12">
          <Widgets.Checkbox
            label={i18n.t("isPaid")}
            value={transaction.isPaid || false}
            onChange={(e) => handleChangeTran("isPaid", e)}
            lblCheckbox={i18n.t("isPaid")}
            disabled={transaction.isRetailCustomers || false}
          />
        </Col>
        <Col md="6" xs="12">
          <Widgets.MoneyInput
            required={true}
            label={i18n.t("intoMoney")}
            value={transaction.intoMoney || ""}
            // onChange={(e) => handleChangeTran("cost", e)}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalSell;
