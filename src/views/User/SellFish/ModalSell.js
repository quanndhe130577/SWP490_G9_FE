import React, { useState, useEffect } from "react";
import ModalCustom from "../../../containers/Antd/ModalCustom";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import { apis, local, session, helper } from "../../../services";
import { API_FETCH } from "../../../constant";
import moment from "moment";

const ModalSell = ({
  isShowSell,
  setShowSell,
  currentTransaction,
  mode,
  dataDf,
  createTransDetail,
  updateTransDetail,
  date,
}) => {
  const [transaction, setTransaction] = useState({
    ...currentTransaction,
  }); // transaction là 1 bản ghi của Trans
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const handleOk = async () => {
    try {
      setLoading(true);
      let validate = validateData();
      if (validate) {
        return helper.toast("error", i18n.t(validate));
      }
      let trader = dataDf.tradersSelected.find(
        (el) => el.id === transaction.traderId
      );
      if (user.roleName === "Trader" && !trader) {
        trader = dataDf.tradersSelected.find((el) => el.id === user.userID);
      }
      let { transactionPrice } = transaction.selectedFT;
      let checkPrice = parseFloat(1 - transaction.sellPrice / transactionPrice);

      let data = {
        fishTypeId: transaction.fishTypeId,
        buyerId: transaction.buyer.key,
        isPaid: transaction.isPaid,
        traderId: trader.id,
        transId: trader.transId,
        sellPrice: transaction.sellPrice,
        weight: parseFloat(transaction.weight),
        date: helper.correctDate(new Date(moment(date, "DDMMYYYY"))),
      };

      // create trans
      let createTransaction = async () => {
        if (createTransDetail) {
          if (user.roleName === "Trader" && data.transId) {
            delete data.transId;
          }
          await createTransDetail(data);
        }
      };
      let doTransaction = async () => {
        if (mode === "create") {
          let fish = transaction.listFishType.find(
            (el) => el.id === transaction.fishTypeId
          );
          if (parseFloat(transaction.weight) > fish.remainWeight) {
            helper.confirm(i18n.t("cfOverWeightSellFish")).then((res) => {
              if (res) {
                createTransaction();
              }
            });
          } else {
            createTransaction();
          }
        } else if (mode === "edit") {
          await updateTransDetail({ ...data, id: transaction.id });
        }
      };
      if (user.roleName !== "Trader" && checkPrice > 0.15) {
        helper.confirm(i18n.t("cfOLowPriceFish")).then((res) => {
          if (res) {
            doTransaction();
          }
        });
      } else {
        doTransaction();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setShowSell(false);
  };
  const handleChangeTran = async (name, value) => {
    if (name === "isRetailCustomers" && value) {
      setTransaction((prevState) => ({
        ...prevState,
        buyer: [],
        isPaid: true,
      }));
    } else if (name === "traderId") {
      getFTByTrader(value);
    } else if (name === "fishTypeId") {
      let currentFT = transaction.listFishType.find(
        (ft) => ft.id === parseInt(value)
      );
      if (!currentFT) {
        return helper.toast("error", i18n("fishTypeInvalid"));
      }
      setTransaction((prevState) => ({
        ...prevState,
        sellPrice: currentFT.transactionPrice,
        selectedFT: currentFT,
      }));
    }
    setTransaction((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // validate các trường required
  const validateData = () => {
    let { weight, fishTypeId, traderId, sellPrice, buyer } = transaction;
    if (user.roleName === "Trader") {
      traderId = user.userID;
      setTransaction((prevState) => ({
        ...prevState,
        traderId: user.userID,
      }));
    }
    if (!weight || !fishTypeId || !traderId || !sellPrice || !buyer) {
      return "fillAll*";
    } else {
      if (weight <= 0.1) {
        return "qtyMustLargerThan0";
      }
      // DO NOT REMOVE
      //  else if (weight > 200) {
      //   setTransaction((prevState) => ({
      //     ...prevState,
      //     weight: 0,
      //   }));
      //   return "qtyMustSmallerThan200";
      // }
    }
  };

  async function convertDataInEditMode() {
    // data to display in create mode and edit mode is difference, we need convert data
    if (mode === "edit") {
      let fishTypeId = transaction.fishType.id,
        isPaid = transaction.isPaid,
        traderId = transaction.trader.id,
        sellPrice = transaction.sellPrice,
        weight = parseFloat(transaction.weight),
        isRetailCustomers = false,
        buyer = [];

      if (transaction.buyer) {
        buyer = {
          key: transaction.buyer.id,
          label: transaction.buyer.name,
          value: transaction.buyer.id,
        };
      } else {
        isRetailCustomers = true;
      }
      if (traderId) {
        getFTByTrader(traderId);
      }
      setTransaction((prevState) => ({
        ...prevState,
        fishTypeId,
        isPaid,
        traderId,
        buyer,
        weight,
        sellPrice,
        isRetailCustomers,
      }));
    } else {
      setTransaction((prevState) => ({
        ...prevState,
        isPaid: false,
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
  async function getFTByTrader(traderId) {
    try {
      let param = traderId;
      if (date) {
        param += "/" + date;
      }
      let rs = await apis.getFTByTrader({}, "GET", param);
      if (rs && rs.statusCode === 200) {
        setTransaction((pre) => ({ ...pre, listFishType: rs.data }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    convertDataInEditMode();
    getBuyer();
    let user = session.get("user") || null;
    if (user) {
      setUser(user);
      if (user.roleName === "Trader") {
        getFTByTrader(user.userID);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ModalCustom
      title={
        mode === "create"
          ? i18n.t("createTransDetail")
          : i18n.t("editTransDetail")
      }
      visible={isShowSell}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      loading={loading}
      component={() => (
        <>
          {user && user.roleDisplayName === "Thương lái" ? (
            // for trader
            <Row>
              <Col md="4" xs="12">
                <Widgets.SearchFetchApi
                  required={true}
                  label={i18n.t("buyer")}
                  value={transaction.buyer || []}
                  onChange={(e) => handleChangeTran("buyer", e)}
                  isOne={true}
                  items={transaction.listBuyer || []}
                  api={API_FETCH.FIND_BUYER}
                  placeholder={i18n.t("enterNameToFindBuyer")}
                  disabled={transaction.isRetailCustomers || false}
                  displayField="name"
                  saveField="id"
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

              {transaction.buyer && (
                <>
                  <Col md="6" xs="12">
                    <Widgets.Select
                      required={true}
                      label={i18n.t("typeOfFish")}
                      value={transaction.fishTypeId || ""}
                      onChange={(e) => handleChangeTran("fishTypeId", e)}
                      items={transaction.listFishType || dataDf.arrFish || []}
                      displayField={["fishName", "remainWeight"]}
                      containLbl={containLbl}
                    />
                  </Col>
                  <Col md="6" xs="12">
                    <Widgets.WeightInput
                      required={true}
                      label={i18n.t("qtyOfFish(Kg-onlyFish)")}
                      value={transaction.weight || 0}
                      onChange={(e) => handleChangeTran("weight", e)}
                    />
                  </Col>
                  <Col md="6" xs="12">
                    <Widgets.MoneyInput
                      required={true}
                      label={i18n.t("sellPrice")}
                      value={transaction.sellPrice || 0}
                      onChange={(e) => handleChangeTran("sellPrice", e)}
                    />
                  </Col>

                  <Col md="6" xs="12">
                    <Widgets.MoneyInput
                      disabled={true}
                      label={i18n.t("intoMoney")}
                      value={transaction.weight * transaction.sellPrice || ""}
                    />
                  </Col>

                  <Col md="6" xs="12">
                    <Widgets.Checkbox
                      label={i18n.t("payStatus")}
                      value={transaction.isPaid || false}
                      onChange={(e) => handleChangeTran("isPaid", e)}
                      lblCheckbox={i18n.t("isPaid")}
                      // lblCheckbox={i18n.t("isNotPaid")}
                      disabled={transaction.isRetailCustomers || false}
                    />
                  </Col>
                </>
              )}
            </Row>
          ) : (
            //for weight recorder
            <Row>
              <Col md="6" xs="12">
                <Widgets.Select
                  required={true}
                  label={i18n.t("trader")}
                  value={transaction.traderId || ""}
                  onChange={(e) => handleChangeTran("traderId", e)}
                  items={dataDf.tradersSelected || []}
                  displayField={["firstName", "lastName"]}
                />
              </Col>

              <Col md="4" xs="12">
                <Widgets.SearchFetchApi
                  required={true}
                  label={i18n.t("buyer")}
                  onChange={(e) => handleChangeTran("buyer", e)}
                  isOne={true}
                  value={transaction.buyer || []}
                  // onSelect={(e) => handleChangeTran("buyer", e)}
                  items={transaction.listBuyer || []}
                  api={API_FETCH.FIND_BUYER}
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

              {transaction.traderId && (
                <>
                  <Col md="6" xs="12">
                    <Widgets.Select
                      required={true}
                      label={i18n.t("typeOfFish")}
                      value={transaction.fishTypeId || ""}
                      onChange={(e) => handleChangeTran("fishTypeId", e)}
                      items={transaction.listFishType || dataDf.arrFish || []}
                      displayField={["fishName", "remainWeight"]}
                      containLbl={containLbl}
                    />
                  </Col>
                  <Col md="6" xs="12">
                    <Widgets.WeightInput
                      required={true}
                      label={i18n.t("qtyOfFish(Kg-onlyFish)")}
                      value={transaction.weight || 0}
                      onChange={(e) => handleChangeTran("weight", e)}
                    />
                  </Col>
                  <Col md="6" xs="12">
                    <Widgets.MoneyInput
                      required={true}
                      label={i18n.t("sellPrice")}
                      value={transaction.sellPrice || 0}
                      onChange={(e) => handleChangeTran("sellPrice", e)}
                    />
                  </Col>
                  <Col md="6" xs="12">
                    <Widgets.Checkbox
                      label={i18n.t("payStatus")}
                      value={transaction.isPaid || false}
                      onChange={(e) => handleChangeTran("isPaid", e)}
                      // lblChecked={i18n.t("isPaid")}
                      lblCheckbox={i18n.t("isPaid")}
                      disabled={transaction.isRetailCustomers || false}
                    />
                  </Col>
                  <Col md="6" xs="12">
                    <Widgets.MoneyInput
                      disabled={true}
                      label={i18n.t("intoMoney")}
                      value={transaction.weight * transaction.sellPrice || ""}
                      // onChange={(e) => handleChangeTran("sellPrice", e)}
                    />
                  </Col>
                </>
              )}
            </Row>
          )}
        </>
      )}
    />
  );
};

export default ModalSell;
const containLbl = {
  text: i18n.t("remain"),
  field: "remainWeight",
  suffix: " Kg",
};
