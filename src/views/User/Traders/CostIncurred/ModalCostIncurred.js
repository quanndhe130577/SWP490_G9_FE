import i18n from "i18next";
import React, { useState, useEffect } from "react";
import { Col, Row } from "reactstrap";
import Modal from "../../../../containers/Antd/ModalCustom";
import Widgets from "../../../../schema/Widgets";
import { apis, helper, session } from "../../../../services";
import moment from "moment";
import { costIncurred } from "../../../../constant";

const ModalEdit = ({ isShow, closeModal, mode, currentCostInc }) => {
  const [costInc, setCostInc] = useState(currentCostInc);
  const [loading, setLoading] = useState(false);
  const [userClient, setUserClient] = useState("weightRecorder");
  useEffect(() => {
    handleChangeCostIncurred(new Date(), "date");
    if (mode === "create") {
      handleChangeCostIncurred("day", "day");
    }
    if (session.get("user").roleName === "Trader") {
      setUserClient("trader");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleChangeCostIncurred = (val, name) => {
    if (name === "name") {
      val = val[val.length - 1];
    }
    setCostInc((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      let user = session.get("user"),
        rs;
      let { date } = costInc;
      if (date) {
        date = helper.correctDate(date);
      }

      if (mode === "create") {
        rs = await apis.createCostIncurred({
          ...costInc,
          date,
          traderID: user.userID,
        });
      } else if (mode === "edit") {
        rs = await apis.updateCostIncurred({ ...costInc, date });
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
            <Widgets.Select
              required={true}
              label={i18n.t("type")}
              value={costInc.typeOfCost || ""}
              onChange={(e) => handleChangeCostIncurred(e, "typeOfCost")}
              items={[
                { value: "day", label: "Ngày" },
                { value: "month", label: "Tháng" },
              ]}
              saveField={"value"}
            />
          </Col>
          {costInc && costInc.typeOfCost && (
            <>
              <Col md="6" xs="12">
                <Widgets.SelectSearchMulti
                  required={true}
                  label={i18n.t("name")}
                  value={costInc.name || []}
                  onChange={(e) => handleChangeCostIncurred(e, "name")}
                  items={costIncurred[costInc.typeOfCost][userClient]}
                  displayField="label"
                  saveField="key"
                />
              </Col>

              <Col md="6" xs="12">
                <Widgets.MoneyInput
                  required={true}
                  label={i18n.t("cost") + i18n.t("(suffix)")}
                  value={costInc.cost || ""}
                  onChange={(e) => handleChangeCostIncurred(e, "cost")}
                />
              </Col>
              <Col md="6" xs="12">
                <Widgets.Text
                  type="text"
                  label={i18n.t("note")}
                  value={costInc.note || ""}
                  onChange={(e) => handleChangeCostIncurred(e, "note")}
                />
              </Col>
              <Col md="6" xs="12">
                <Widgets.DateTimePicker
                  type="date"
                  label={i18n.t("date")}
                  value={
                    costInc
                      ? moment(costInc.date).format("DD/MM/YYYY")
                      : moment(new Date()).format("DD/MM/YYYY")
                  }
                  onChange={(e) => handleChangeCostIncurred(e, "date")}
                />
              </Col>
            </>
          )}
        </Row>
      )}
    />
  );
};

export default ModalEdit;
