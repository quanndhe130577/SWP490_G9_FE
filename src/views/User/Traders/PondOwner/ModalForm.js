import React, {useState} from "react";
import {Row, Col} from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import {message} from 'antd';

const ModalEdit = ({isShow, closeModal, mode, currentPO}) => {
  const [pondOwner, setPO] = useState(currentPO);

  const handleChangePondOwner = (val, name) => {
    setPO((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const checkValidate = (data) => {
    const phoneNumberVNRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
    if (!phoneNumberVNRegex.test(data)) {
      return {isValid: false, message: 'Số điện thoại không đúng'};
    }
    return {isValid: true, message: ''};
  }
  const handleOk = async () => {
    try {
      let user = session.get("user"), rs;
      let valid = checkValidate(pondOwner.phoneNumber);
      if (!valid.isValid) {
        message.error(valid.message)
        return;
      }

      if (mode === "create") {
        rs = await apis.createPO({
          name: pondOwner.name,
          address: pondOwner.address,
          phoneNumber: pondOwner.phoneNumber,
          traderID: user.userID,
        });
      } else if (mode === "edit") {
        rs = await apis.updatePO(pondOwner);
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
              label={i18n.t("name")}
              value={pondOwner.name || ""}
              onChange={(e) => handleChangePondOwner(e, "name")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
              label={i18n.t("address")}
              value={pondOwner.address || ""}
              onChange={(e) => handleChangePondOwner(e, "address")}
            />
          </Col>
          <Col md="6" xs="12">
            <Widgets.Text
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

export default ModalEdit;
