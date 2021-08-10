import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import { apis, helper } from "../../../../services";

const ModalEdit = ({ isShow, closeModal, mode, currentFT }) => {
  const [fishType, setFT] = useState(currentFT);

  const handleChangeFishType = (val, name) => {
    setFT((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const handleOk = async () => {
    try {
      let rs;
      if (mode === "create") {
        rs = await apis.createFT({
          ...fishType,
        });
      } else if (mode === "edit") {
        rs = await apis.updateFT(fishType);
      }

      if (rs && rs.statusCode === 200) {
        closeModal(true);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", i18n.t("systemError"));
    }
  };
  // useEffect(() => {
  //   handleChangeFishType(new Date(), "date");
  // }, []);
  return (
    <Modal
      title={mode === "edit" ? i18n.t("edit") : i18n.t("create")}
      visible={isShow}
      onOk={handleOk}
      onCancel={closeModal}
      component={() => (
        <Row>
          <Col md="6" xs="12">
            <Widgets.Text
              required={true}
              label={i18n.t("Fish Name")}
              value={fishType.fishName || ""}
              onChange={(e) => handleChangeFishType(e, "fishName")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              label={i18n.t("Description")}
              value={fishType.description || ""}
              onChange={(e) => handleChangeFishType(e, "description")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.WeightInput
              type="number"
              required={true}
              label={i18n.t("minWeight")}
              value={fishType.minWeight || ""}
              onChange={(e) => handleChangeFishType(e, "minWeight")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.WeightInput
              label={i18n.t("maxWeight")}
              value={fishType.maxWeight || ""}
              onChange={(e) => handleChangeFishType(e, "maxWeight")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.MoneyInput
              type="number"
              required={true}
              label={i18n.t("buyPrice") + i18n.t("(suffix)")}
              value={fishType.price || ""}
              onChange={(e) => handleChangeFishType(e, "price")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.MoneyInput
              required={true}
              label={i18n.t("sellPrice(VND)")}
              value={fishType.transactionPrice || ""}
              onChange={(e) => handleChangeFishType(e, "transactionPrice")}
            />
          </Col>
          {/* <Col md="6" xs="12">
            <Widgets.DateTimePicker
              required={true}
              label={i18n.t("Sell Date FT")}
              value={fishType.date || new Date()}
              // maxDate={new Date()}
              // minDate={minDate}
              onChange={(data) => {
                //this.setState({ date: new Date(data) });
                handleChangeFishType(new Date(data), "date");
                //console.log(data);
              }}
            />
          </Col> */}
        </Row>
      )}
    />
  );
};

export default ModalEdit;
