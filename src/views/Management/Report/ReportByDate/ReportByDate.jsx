import React, { useEffect, useState } from "react";
import { helper, apis, session } from "../../../../services";
import Loading from "../../../../containers/Antd/LoadingCustom";
import { Row, Col } from "reactstrap";
import { Card, Table } from "antd";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import NumberFormat from "react-number-format";
import Moment from "react-moment";

const ReportByDate = () => {
  const [loading, setLoading] = useState(false);
  const [purchaseTotal, setPurchaseTotal] = useState({
    listSummaryPurchaseDetail: [],
    summaryMoney: 0,
    summaryWeight: 0,
  });
  const [transactionTotal, setTransactionTotal] = useState({
    listSummaryTransactionDetail: [],
    summaryMoney: 0,
    summaryWeight: 0,
    summaryCommission: 0,
  });
  const [date, setDate] = useState();
  const [listCostIncurred, setListCostIncurred] = useState([]);
  const [user, setUser] = useState(session.get("user"));

  async function fetchData(date) {
    try {
      setLoading(true);
      if (!date) {
        date = helper.getDateFormat(new Date(), "ddmmyyyy");
      }
      let rs = await apis.reportDate({}, "GET", date);
      if (rs && rs.statusCode === 200) {
        let { purchaseTotal, transactionTotal, listCostIncurred, date } =
          rs.data;
        setPurchaseTotal(purchaseTotal);
        setTransactionTotal(transactionTotal);
        setListCostIncurred(listCostIncurred);
        setDate(date);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
    setUser(session.get("user"));
  }, []);

  const renderTitle = () => {
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">
            {i18n.t("report.buy-sell-date")}
            {date && (
              <Moment format="DD-MM-yyyy" className="ml-2">
                {date}
              </Moment>
            )}
          </h3>
        </Col>
      </Row>
    );
  };
  if (loading) {
    return <Loading />;
  } else
    return (
      <Card title={renderTitle()} className="body-minH">
        <Row>
          {user.roleName === "Trader" && (
            <Col md="6" xs="12" className="rp-tb rp-left">
              {/* FOR PURCHASE */}

              <h4 className="title mb-0">{i18n.t("buyFish")}</h4>

              <div className="under-title mb-3">
                <div className="under-title-line" />
              </div>

              {purchaseTotal.listSummaryPurchaseDetail.length > 0 ? (
                <>
                  {fTTable(purchaseTotal.listSummaryPurchaseDetail, user)}
                  <Widgets.NumberFormat
                    label={i18n.t("totalWeight") + ": "}
                    value={purchaseTotal.summaryWeight}
                    suffix=" Kg"
                  />
                  <Widgets.NumberFormat
                    label={i18n.t("totalMoney") + ": "}
                    value={purchaseTotal.summaryMoney}
                  />
                </>
              ) : (
                <div className="noData">
                  <i className="fa fa-file-o mr-1" />
                  {i18n.t("dataNotYet")}
                </div>
              )}
            </Col>
          )}
          <Col md="6" xs="12" className="rp-tb ">
            {/* FOR TRANSACTION */}

            <h4 className="title mb-0">{i18n.t("sellFish")}</h4>
            <div className="under-title mb-3">
              <div className="under-title-line" />
            </div>
            {transactionTotal.listSummaryTransactionDetail.length > 0 ? (
              <>
                {fTTable2(transactionTotal.listSummaryTransactionDetail, user)}
                <Widgets.NumberFormat
                  label={i18n.t("totalWeight") + ": "}
                  value={transactionTotal.summaryWeight}
                  suffix=" Kg"
                />
                <Widgets.NumberFormat
                  label={i18n.t("totalMoney") + ": "}
                  value={transactionTotal.summaryMoney}
                />
              </>
            ) : (
              <div className="noData">
                <i className="fa fa-file-o mr-1" />
                {i18n.t("dataNotYet")}
              </div>
            )}
          </Col>
        </Row>
        <Row>
          {listCostIncurred.length > 0 ? (
            <div>
              {listCostIncurred.map((el) => (
                <div>{el.name}</div>
              ))}
            </div>
          ) : (
            ""
          )}
        </Row>
      </Card>
    );
};

export default ReportByDate;

const fTTable = (listSummaryPurchaseDetail) => {
  if (listSummaryPurchaseDetail.length > 0)
    return (
      <div>
        {listSummaryPurchaseDetail.map((el, idx) => (
          <div className="mb-3">
            <h6>
              <b>{i18n.t("pondOwner")}: </b>
              {el.pondOwner.name}
            </h6>
            <Table
              rowKey={idx}
              columns={columns}
              dataSource={el.purchaseDetails}
              bordered
              pagination={false}
              summary={() => {
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        key="1"
                        // colSpan="2"
                        className="bold"
                      >
                        {i18n.t("total")}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell key="2" className="bold">
                        <NumberFormat
                          value={el.totalWeight.toFixed(1)}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix=" Kg"
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell key="3" className="bold">
                        <NumberFormat
                          value={el.totalMoney}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix=" VND"
                        />
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
            />
          </div>
        ))}
      </div>
    );
};
const fTTable2 = (listSummaryPurchaseDetail, user) => {
  if (listSummaryPurchaseDetail.length > 0)
    return (
      <div>
        {listSummaryPurchaseDetail.map((el, idx) => (
          <div className="mb-3">
            {user.roleName === "WeightRecorder" ? (
              <h6>
                <b>{i18n.t("trader")}: </b>
                {el.trader.firstName + " " + el.trader.lastName}
              </h6>
            ) : el.weightRecorder ? (
              <h6>
                <b>{i18n.t("weightRecorder")}: </b>
                {el.weightRecorder.firstName + " " + el.weightRecorder.lastName}
              </h6>
            ) : (
              <h6>
                <b>{i18n.t("buyBySelf")}</b>
              </h6>
            )}

            <Table
              columns={columns2}
              dataSource={el.transactionDetails}
              bordered
              pagination={false}
              rowKey={idx}
              summary={() => {
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell
                        key="1"
                        // colSpan="2"
                        className="bold"
                      >
                        {i18n.t("total")}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell key="2" className="bold">
                        <NumberFormat
                          value={el.totalWeight.toFixed(1)}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix=" Kg"
                        />
                      </Table.Summary.Cell>
                      <Table.Summary.Cell key="3" className="bold">
                        <NumberFormat
                          value={el.totalMoney}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix=" VND"
                        />
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
            />
          </div>
        ))}
      </div>
    );
};
const columns = [
  {
    title: i18n.t("fishName"),
    dataIndex: "fishType",
    key: "fishType",
    render: (fishType) => <span>{fishType && fishType.fishName}</span>,
  },
  {
    title: i18n.t("fishWeight"),
    dataIndex: "weight",
    key: "weight",
    render: (weight) => (
      <Widgets.NumberFormat value={weight} needSuffix={false} />
    ),
  },
  {
    title: i18n.t("intoMoney"),
    dataIndex: "price",
    key: "price",
    render: (price) => (
      <Widgets.NumberFormat needSuffix={false} value={price} />
    ),
  },
];
const columns2 = [
  {
    title: i18n.t("fishName"),
    dataIndex: "fishType",
    key: "fishType",
    render: (fishType) => <span>{fishType && fishType.fishName}</span>,
  },
  {
    title: i18n.t("fishWeight"),
    dataIndex: "weight",
    key: "weight",
    render: (weight) => (
      <Widgets.NumberFormat value={weight} needSuffix={false} />
    ),
  },
  {
    title: i18n.t("intoMoney"),
    dataIndex: "sellPrice",
    key: "sellPrice",
    render: (sellPrice) => (
      <Widgets.NumberFormat needSuffix={false} value={sellPrice} />
    ),
  },
];
