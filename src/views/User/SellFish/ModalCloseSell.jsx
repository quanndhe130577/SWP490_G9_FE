import React, { useState, useEffect } from "react";
import Modal from "../../../containers/Antd/ModalCustom";
import { Row, Col } from "reactstrap";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import Moment from "react-moment";

const ModalCloseSell = ({
  isShowCloseTransaction,
  listTransaction,
  // prCurrentTransaction,
  handleCloseModal,
  dataDf,
}) => {
  const [currentTransaction, setCurrentTransaction] = useState({});
  // transaction là 1 bản ghi của transaction
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(false);
  };

  const handleCancel = () => {
    handleCloseModal(!isShowCloseTransaction);
  };
  const handleChangeTran = (name, val) => {
    if (name === "traderId") {
      let trader = dataDf.tradersSelected.find((el) => el.id === val);
      let trans = listTransaction.find((el) => el.id === trader.transId);

      setCurrentTransaction((pre) => ({ ...pre, ...trans }));
    }
    setCurrentTransaction((pre) => ({ ...pre, [name]: val }));
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      title={i18n.t("closeTransaction")}
      visible={isShowCloseTransaction}
      onOk={handleOk}
      onCancel={handleCancel}
      loading={loading}
      component={() => (
        <Row>
          <Col md="12">
            <label className="mr-2">
              <b>{i18n.t("date")}:</b>
              <Moment format="DD/MM/YYYY" className="ml-2">
                {currentTransaction && currentTransaction.date}
              </Moment>
            </label>
          </Col>
          <Col md="6">
            <Widgets.Select
              required={true}
              label={i18n.t("trader")}
              value={currentTransaction.traderId || ""}
              onChange={(e) => handleChangeTran("traderId", e)}
              items={dataDf.tradersSelected || []}
              displayField={["firstName", "lastName"]}
            />
          </Col>
          {/* <Col md="6">
            <Widgets.WeightInput
              label={i18n.t("percent")}
              value={currentTransaction.commission || ""}
              onChange={(val) => handleTransaction("commission", val)}
            />
          </Col>
          <Col md="6">
            <Widgets.Checkbox
              label={i18n.t("payStatus")}
              value={currentTransaction.isPaid}
              onChange={(val) => handleTransaction("isPaid", val)}
              lblCheckbox={
                currentTransaction.isPaid ? i18n.t("paid") : i18n.t("isNotPaid")
              }
            />
          </Col> */}
        </Row>
      )}
    />
  );
};

export default ModalCloseSell;
