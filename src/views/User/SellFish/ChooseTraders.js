import React from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import { local, helper, apis } from "../../../services";
import TradersToday from "./TradersToday";
import moment from "moment";
import { useHistory } from "react-router-dom";

const ChooseTraders = ({
  isShowChooseTraders,
  setShowChooseTraders,
  currentTransaction = {},
  dataFetched,
  handleChangeCurrentTrans,
  date,
}) => {
  let isChange = false;
  const history = useHistory();

  const handleOk = async () => {
    if (!currentTransaction.id) {
      // create transaction
      try {
        let rs = await apis.createTransactions({
          // date: helper.getDateFormat(),
          date: helper.correctDate(new Date(moment(date, "DDMMYYYY"))),
          listTraderId: currentTransaction.listTraderId,
        });
        if (rs && rs.statusCode === 200) {
          helper.toast("success", i18n.t(rs.message || "success"));
          history.push(
            //"sellFish?date=" + helper.getDateFormat(new Date(), "ddmmyyyy")
            "sellFish?date=" + date
          );
          setShowChooseTraders(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleCancel = () => {
    if (!isChange) {
      setShowChooseTraders(false);
    } else {
      // if trader null cant close modal
      let check = validate(currentTransaction, "trader");
      if (!check) {
        onChange(currentTransaction.trader, "trader");
        setShowChooseTraders(false);
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
      let tem = currentTransaction;
      if (prop === "trader") {
        tem.trader = val + "";
      } else {
        tem[prop] = val;
      }

      local.set("currentTransaction", tem);
      handleChangeCurrentTrans(prop, val);
    }
  };
  function convertField(arr) {
    arr.map((el) => (el.name = el.firstName.trim() + " " + el.lastName.trim()));
    return arr;
  }

  return (
    <Modal
      title={i18n.t("choseTrader")}
      centered
      visible={isShowChooseTraders}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
    >
      <Row>
        <Col md="4" xs="12">
          <Widgets.SelectSearchMulti
            label={i18n.t("choseTrader")}
            value={currentTransaction.listTraderId || []}
            items={convertField(dataFetched.traders || [])}
            onChange={(vl) => onChange(vl, "listTraderId")}
            saveField="id"
          />
        </Col>
        <Col md="8" xs="12">
          <label className="bold">{i18n.t("listTrader")}</label>
          <TradersToday
            listTraderId={currentTransaction.listTraderId || []}
            onChange={(arr) => onChange(arr, "arrFish")}
            dataFetched={dataFetched}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ChooseTraders;
