import React, { useEffect, useState } from "react";
import { helper, apis, session } from "../../../../services";
import Loading from "../../../../containers/Antd/LoadingCustom";
import { Row, Col } from "reactstrap";
import { Card, Table } from "antd";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import NumberFormat from "react-number-format";

const ReportDaily = () => {
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
  const [data, setData] = useState({});
  const [CostIncurred, setCostIncurred] = useState({ totalCost: 0 });
  const [user, setUser] = useState();

  async function fetchData(date) {
    try {
      setLoading(true);

      // if (!date) {
      //   date = helper.getDateFormat(new Date(), "ddmmyyyy");
      // } else {
      date = helper.getDateFormat(date, "ddmmyyyy");
      // }
      let rs = await apis.reportDate({}, "GET", date);
      if (rs && rs.statusCode === 200) {
        let {
          purchaseTotal,
          transactionTotal,
          listCostIncurred,
          date,
          tongChi,
          tongNo,
          tongThu,
        } = rs.data;
        let totalCost = 0;
        for (const el of listCostIncurred) {
          totalCost += el.cost;
        }
        setPurchaseTotal(purchaseTotal);
        setTransactionTotal(transactionTotal);
        setCostIncurred({ totalCost, listCostIncurred });
        setDate(new Date(date));
        setData({ tongChi, tongNo, tongThu });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData(new Date());
    setUser(session.get("user"));
  }, []);

  const renderTitle = () => {
    return (
      <Row>
        <Col md="12">
          <h4 className="d-flex">
            {i18n.t("report.buy-sell-date")}
            {/* {date && (
              <Moment format="DD-MM-yyyy" className="ml-2">
                {date}
              </Moment>
            )} */}
            <Widgets.DateTimePicker
              value={date || new Date()}
              needCorrect={false}
              onChange={(value) => {
                fetchData(value);
              }}
            />
          </h4>
        </Col>
      </Row>
    );
  };
  if (loading) {
    return <Loading />;
  } else
    return (
      <Card title={renderTitle()} className="body-minH">
        {/* <Row>
          <Widgets.DateTimePicker
            label="Ngày"
            value={date || new Date()}
            needCorrect={false}
            onChange={(value) => {
              fetchData(value);
            }}
          />
        </Row> */}
        <Row>
          {user && user.roleName === "Trader" && (
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
                    label={i18n.t("totalMoneyFish") + ": "}
                    value={purchaseTotal.summaryMoney}
                  />
                  <Widgets.NumberFormat
                    label={i18n.t("CostIncurredManagement") + ": "}
                    value={CostIncurred.totalCost}
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
          <Col md="6">
            <h4>
              <Widgets.NumberFormat
                label={i18n.t("tongChi") + ": "}
                value={data.tongChi}
              />
            </h4>
          </Col>
          <Col md="6">
            <h4>
              <Widgets.NumberFormat
                label={i18n.t("tongThu") + ": "}
                value={data.tongThu}
              />
            </h4>
          </Col>
        </Row>
      </Card>
    );
};

export default ReportDaily;

const fTTable = (listSummaryPurchaseDetail) => {
  if (listSummaryPurchaseDetail.length > 0)
    return (
      <div>
        {listSummaryPurchaseDetail.map((el) => (
          <div className="mb-3">
            <h6>
              <b>{i18n.t("pondOwner")}: </b>
              {el.pondOwner.name}
            </h6>
            <Table
              rowKey="idx"
              columns={columns}
              dataSource={el.purchaseDetails}
              bordered
              pagination={false}
              summary={() => (
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
              )}
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
        {listSummaryPurchaseDetail.map((el) => (
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
              rowKey="idx"
              columns={columns2}
              dataSource={el.transactionDetails}
              bordered
              pagination={false}
              summary={() => {
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell key="1" className="bold">
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
// const costIncurred = (CostIncurred) => {
//   return (
//     <Collapse defaultActiveKey={["1"]} ghost>
//       <Panel
//         header={
//           <Widgets.NumberFormat
//             label={i18n.t("CostIncurredManagement") + ": "}
//             value={CostIncurred.totalCost}
//           />
//         }
//         key="1"
//       ></Panel>
//     </Collapse>
//   );
// };
