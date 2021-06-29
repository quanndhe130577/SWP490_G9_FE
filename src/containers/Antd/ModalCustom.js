import React from "react";
import { Modal, Button } from "antd";
import i18n from "i18next";

const ModalCustom = ({
  visible,
  onCancel,
  onOk,
  title,
  component,
  titleBtnCancel = i18n.t("cancel"),
  titleBtnOk = i18n.t(title || "ok"),
  loading,
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button
          key="back"
          type="danger"
          className="mr-2"
          onClick={onCancel}
          disabled={loading}
        >
          {titleBtnCancel}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onOk}
          disabled={loading}
        >
          {titleBtnOk}
        </Button>,
      ]}
    >
      {component()}
    </Modal>
  );
};

export default ModalCustom;
