import React, { useState, useEffect } from "react";
import ModalCustom from "../../../containers/Antd/ModalCustom";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import { apis, local, session, helper } from "../../../services";
import { API_FETCH } from "../../../constant";

const ModalBuyer = ({ loading, isShowBuyer, date, setShowBuyer }) => {
  const handleOk = async () => {};
  const handleCancel = () => {
    setShowBuyer(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ModalCustom
      title="buyer"
      visible={isShowBuyer}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      loading={loading}
      component={() => <div>ds</div>}
    />
  );
};

export default ModalBuyer;
