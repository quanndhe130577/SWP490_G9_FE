import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";

const ModalPondOwner = ({ isShow, closeModal, mode, currentPO }) => {
  const [pondOwner, setPO] = useState(currentPO);
  const [loading, setLoading] = useState(false);

  const handleChangePondOwner = (val, name) => {
    // set state pondOwner by name and value
    setPO((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  //
  const validatePhoneNumber = (data) => {
    const phoneNumberVNRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneNumberVNRegex.test(data)) {
      return { isValid: false, message: "Số điện thoại không đúng" };
    }
    return { isValid: true, message: "" };
  };

  // handle click btn ok
  const handleOk = async () => {
    try {
      setLoading(true);
      let user = session.get("user"),
        rs;

      // validate name, phone number: can't null
      if (!pondOwner.name || !pondOwner.phoneNumber) {
        return helper.toast("error", i18n.t("fillAll*"));
      }

      // validate regex phone
      let valid = validatePhoneNumber(pondOwner.phoneNumber);
      if (!valid.isValid) {
        return helper.toast("error", valid.message);
      }

      // api create PO
      if (mode === "create") {
        rs = await apis.createPO({
          name: pondOwner.name,
          address: pondOwner.address,
          phoneNumber: pondOwner.phoneNumber,
          traderID: user.userID,
        });
      } else if (mode === "edit") {
        // api update PO
        rs = await apis.updatePO(pondOwner);
      }

      if (rs && rs.statusCode === 200) {
        closeModal(true);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", i18n.t("systemError"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title={mode === "edit" ? i18n.t("edit") : i18n.t("create")}
      visible={isShow}
      onOk={handleOk}
      onCancel={closeModal}
      loading={loading}
      component={() => (
        <Row>
          <Col md="6" xs="12">
            <Widgets.Text
              required={true}
              label={i18n.t("name")}
              value={pondOwner.name || ""}
              onChange={(e) => handleChangePondOwner(e, "name")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              // required={true}
              label={i18n.t("address")}
              value={pondOwner.address || ""}
              onChange={(e) => handleChangePondOwner(e, "address")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Phone
              required={true}
              type="number"
              label={i18n.t("phone")}
              value={pondOwner.phoneNumber || ""}
              onChange={(e) => handleChangePondOwner(e, "phoneNumber")}
            />
          </Col>
        </Row>
      )}
    />
  );
};

export default ModalPondOwner;
