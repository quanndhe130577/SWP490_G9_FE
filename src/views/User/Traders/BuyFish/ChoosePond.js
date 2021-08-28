import React, { useState } from "react";
import { Modal } from "antd";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import PriceFishToday from "./PriceFishToday";
import { local, helper, apis } from "../../../../services";
import { useHistory } from "react-router-dom";

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
    //updateAllFishType
    // neu ko co id purchase thì tạo purchase mới
    let checkFT = dataChange.find(ft => !ft.fishName || !ft.minWeight || !ft.price || !ft.transactionPrice)
    if (checkFT) {
      return helper.toast("error", "Vui lòng điền đầy đủ các trường dữ liệu")
    }
    if (createPurchase && !currentPurchase.id) {
      let purchase = await createPurchase();
      if (purchase !== undefined) {
        let rs = await updateFishType(purchase, dataChange, false);
        if (rs) {
          helper.toast("success", "Tạo đơn mua thành công");
          local.set("historyPurchase", purchase);
          history.push("buyFish?id=" + purchase.id);
        } else {
          // let rsDelete = await apis.deletePurchase({ purchaseId: purchase.id });
          await apis.deletePurchase({ purchaseId: purchase.id });
          setCurrentPurchase((prevState) => ({
            ...prevState,
            id: undefined,
          }));
        }
      }
      // update fishtype khi ở trong page purchase detail
    } else if (currentPurchase.id) {
      let rs = await updateFishType(currentPurchase, dataChange, true);
      if (rs) {
        setShowChoosePond(false);
      }
    }
  };

  //quannd
  const updateFishType = async (
    currentPurchase,
    dataChange,
    isShowModal = false,
    onlyFe = false
  ) => {
    let rs = await updateAllFishType(
      { purchaseId: currentPurchase.id, listFishType: dataChange },
      currentPurchase,
      onlyFe
    );
    if (rs) {
      dataChange.forEach((element) => {
        let list = [...currentPurchase.listFishId];
        if (
          list.find((item) => parseInt(item) === parseInt(element.id)) ===
          undefined
        ) {
          list.push(element.id + "");
          onChange(list, "listFishId");
        }
      });

      setShowChoosePond(isShowModal);
      return true;
    }
    return false;
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

  function renderTitleModal(listFishId = []) {
    let title = "modal.title.createNewPurchase";
    if (listFishId.length >= 1) {
      title = "modal.title.updatePurchase";
    }
    return i18n.t(title);
  }

  return (
    <Modal
      title={renderTitleModal(currentPurchase.listFishId)}
      centered
      visible={isShowChoosePond}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1200}
    >
      <Row>
        <Col md="4" xs="12">
          <Widgets.Select
            label={i18n.t("pondOwner")}
            value={parseInt(pondOwner || currentPurchase.pondOwnerId)}
            items={dataDf.pondOwner}
            onChange={(vl) => onChange(vl, "pondOwnerId")}
            needPleaseChose={false}
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
            dateTime={currentPurchase.date}
            dataChange={(data) => {
              setDataChange(data);
            }}
            removeFishType={(id) => {
              let newListFishId = currentPurchase.listFishId.filter(
                (x) => parseInt(x) !== parseInt(id)
              );
              onChange(newListFishId, "listFishId");
            }}
            updateOnlyFe={async (arr) => {
              updateFishType(currentPurchase, arr, true, true);
            }}
          />
        </Col>
        <Col md="4" xs="12" />
      </Row>
    </Modal>
  );
};

export default ChoosePond;
