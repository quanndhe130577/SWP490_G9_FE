import React from "react";
import { Modal, Button } from "antd";
import i18n from "i18next";

const ChoosePond = () => {
  return (
    <Modal
      title={i18n.t("ChoosePond")}
      centered
      //   visible={visible}
      //   onOk={() => setVisible(false)}
      //   onCancel={() => setVisible(false)}
      width={1000}
    >
      <p>some contents...</p>
      <p>some contents...</p>
      <p>some contents...</p>
    </Modal>
  );
};

export default ChoosePond;
