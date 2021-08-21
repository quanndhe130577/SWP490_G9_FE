import React, { useState, useEffect } from "react";
import ModalCustom from "../../../containers/Antd/ModalCustom";
import { Row, Col } from "reactstrap";
import { Table } from "antd";
import i18n from "i18next";
import Widgets from "../../../schema/Widgets";
import { apis, helper } from "../../../services";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import moment from "moment";

const ModalBuyer = ({ isShowBuyer, date, setShowBuyer, getAllTransByDate }) => {
  const [loading, setLoading] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [listTransDetail, setListTransDetail] = useState([]);
  const [currentDetail, setCurrentDetail] = useState({});

  const handleOk = async () => {
    try {
      let rs = await apis.paymentForBuyer({
        buyerId: currentDetail.buyerId,
        date: currentDetail.date,
      });
      if (rs && rs.statusCode === 200) {
        helper.toast("success", i18n.t(rs.message || "success"));
        setShowBuyer(false);
        getAllTransByDate(date);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setShowBuyer(false);
  };
  const handleCurrentDetail = (pro, value) => {
    setLoading(true);
    if (pro === "buyerId") {
      let listDetails = listTransDetail.find((el) => el.buyer.id === value);
      setCurrentDetail({ ...listDetails });
    }
    setCurrentDetail((preStates) => ({ ...preStates, [pro]: value }));
    setLoading(false);
  };
  async function getTransDTByBuyer(date) {
    try {
      setLoading(true);

      let rs = await apis.getTransDTByBuyer({}, "GET", date);

      if (rs && rs.statusCode === 200) {
        let buyers = [];
        rs.data.map((el) => buyers.push(el.buyer));
        setBuyers(buyers);
        setListTransDetail(rs.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  const summaryTable = () => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row>
          <Table.Summary.Cell colSpan="2" key="1" className="bold">
            {i18n.t("total")}
          </Table.Summary.Cell>
          <Table.Summary.Cell key="2" className="bold" colSpan="2">
            <NumberFormat
              value={currentDetail.totalWeight.toFixed(1)}
              displayType={"text"}
              thousandSeparator={true}
            />
          </Table.Summary.Cell>
          <Table.Summary.Cell key="3" className="bold" colSpan="4">
            <NumberFormat
              value={currentDetail.totalMoney}
              displayType={"text"}
              thousandSeparator={true}
            />
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };
  useEffect(() => {
    getTransDTByBuyer(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ModalCustom
      title={i18n.t("payment")}
      visible={isShowBuyer}
      onOk={handleOk}
      disabledOk={
        currentDetail && currentDetail.moneyNotPaid === 0 ? true : false
      }
      onCancel={handleCancel}
      width={
        currentDetail.transactionDetails &&
        currentDetail.transactionDetails.length > 0
          ? 1000
          : 800
      }
      loading={loading}
      component={() => (
        <Row>
          <Col md="12">
            <label className="mr-2">
              <b>{i18n.t("date")}:</b>
              <Moment format="DD/MM/YYYY" className="ml-2">
                {new Date(moment(date, "DDMMYYYY"))}
              </Moment>
            </label>
          </Col>
          <Col md="6">
            <Widgets.Select
              required={true}
              label={i18n.t("buyer")}
              value={currentDetail.buyerId || ""}
              onChange={(e) => handleCurrentDetail("buyerId", e)}
              items={buyers || []}
              displayField={"name"}
            />
          </Col>
          {currentDetail.buyerId && (
            <>
              <Col md="12" className="mb-3">
                {currentDetail.transactionDetails &&
                  currentDetail.transactionDetails.length > 0 && (
                    <Table
                      rowKey="id"
                      columns={columns}
                      dataSource={currentDetail.transactionDetails || []}
                      scroll={{ y: 420 }}
                      pagination={false}
                      bordered
                      summary={summaryTable}
                    />
                  )}
              </Col>
              <Col md="6">
                <Widgets.NumberFormat
                  label={i18n.t("moneyPaid") + ": "}
                  value={currentDetail.moneyPaid || ""}
                />
              </Col>
              <Col md="6">
                <Widgets.NumberFormat
                  label={i18n.t("moneyNotPaid") + ": "}
                  value={currentDetail.moneyNotPaid || ""}
                />
              </Col>
            </>
          )}
        </Row>
      )}
    />
  );
};

export default ModalBuyer;
const columns = [
  {
    title: "STT",
    width: 60,
    render: (el, row, idx) => <label className="antd-tb-idx">{idx + 1}</label>,
  },
  {
    title: i18n.t("typeOfFish"),
    dataIndex: "fishType",
    key: "fishType",
    render: (fishType) => (
      <div>{fishType && <label>{fishType.fishName}</label>}</div>
    ),
  },
  {
    title: i18n.t("qtyOfFish(Kg-onlyFish)"),
    dataIndex: "weight",
    key: "weight",
  },
  {
    title: i18n.t("sellPrice(VND)"),
    dataIndex: "sellPrice",
    key: "sellPrice",
    render: (sellPrice) => (
      <NumberFormat
        value={sellPrice}
        displayType={"text"}
        thousandSeparator={true}
      />
    ),
  },
  {
    title: i18n.t("intoMoney"),
    render: (el, row) => <label>{calculateIntoMoney(row)}</label>,
  },
  {
    title: i18n.t("trader"),
    dataIndex: "trader",
    key: "trader",
    render: (trader) => {
      return <div>{trader && trader.firstName + " " + trader.lastName}</div>;
    },
  },
  {
    title: i18n.t("statusPaid"),
    dataIndex: "isPaid",
    key: "isPaid",
    render: (isPaid) => helper.tag(isPaid ? "isPaid" : "notPaid"),
  },
];
const calculateIntoMoney = ({ sellPrice, weight }) => (
  <NumberFormat
    value={sellPrice * weight}
    displayType={"text"}
    thousandSeparator={true}
  />
);
