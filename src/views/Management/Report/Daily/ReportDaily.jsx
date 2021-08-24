import React, { useEffect, useState } from "react";
import { helper, apis, session } from "../../../../services";
import Loading from "../../../../containers/Antd/LoadingCustom";
import { Row, Col } from "reactstrap";
import { Card, Table } from "antd";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import NumberFormat from "react-number-format";
import RemainTable from "./RemainTable";

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
  const [remainTotal, setRemainTotal] = useState();

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
          remainTotal,
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
        setRemainTotal(remainTotal);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  function handleStyleProfit(profit) {
    let style = "ml-2 ";
    if (profit > 0) {
      style += " primary";
    } else {
      style += " danger";
    }
    return style;
  }
  useEffect(() => {
    fetchData(new Date());
    setUser(session.get("user"));
  }, []);

  const renderTitle = () => {
    return (
      <Row>
        <Col md="12">
          <h4 className="d-flex">{i18n.t("report.buy-sell-date")}</h4>
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
          <b className="mr-2 mt-2 ml-3">{i18n.t("selectDay")}</b>
          <Widgets.DateTimePicker
            value={date || new Date()}
            needCorrect={false}
            onChange={(value) => {
              fetchData(value);
            }}
          />
        </Row>
        <Row>
          {user && user.roleName === "Trader" && (
            <Col md="4">
              <h4>
                <Widgets.NumberFormat
                  label={i18n.t("tongChi") + ": "}
                  value={data.tongChi}
                />
              </h4>
              <Widgets.NumberFormat
                label={i18n.t("buyWeight") + ": "}
                value={purchaseTotal.summaryWeight}
                suffix=" Kg"
              />

              <Widgets.NumberFormat
                label={i18n.t("moneyBuyFish") + ": "}
                value={purchaseTotal.summaryMoney}
              />
              <Widgets.NumberFormat
                label={i18n.t("CostIncurredManagement") + ": "}
                value={CostIncurred.totalCost}
              />
            </Col>
          )}

          <Col md="4">
            <h4>
              <Widgets.NumberFormat
                label={i18n.t("tongThu") + ": "}
                value={data.tongThu}
              />
            </h4>
            <Widgets.NumberFormat
              label={i18n.t("sellWeight") + ": "}
              value={transactionTotal.summaryWeight}
              suffix=" Kg"
            />
            <Widgets.NumberFormat
              label={i18n.t("moneySellFish") + ": "}
              value={transactionTotal.summaryMoney}
            />
            <Widgets.NumberFormat
              label={i18n.t("moneyCommission") + ": "}
              value={transactionTotal.summaryCommission}
            />
            {user.roleName !== "Trader" && (
              <Widgets.NumberFormat
                label={i18n.t("CostIncurredManagement") + ": "}
                value={CostIncurred.totalCost}
              />
            )}
          </Col>
          {user &&
            user.roleName === "Trader" &&
            remainTotal &&
            remainTotal.remainDetails.length > 0 && (
              <RemainTable remainTotal={remainTotal} />
            )}
        </Row>
        {data.tongThu - data.tongChi > 0 ? (
          <Row>
            <Col md="6">
              <h4 className="mt-4 mb-0 d-flex">
                <span>
                  {i18n.t(
                    user.roleName === "Trader" ? "profit" : "wcReceiver"
                  ) + ": "}
                </span>
                <span
                  className={handleStyleProfit(data.tongThu - data.tongChi)}
                >
                  {new Intl.NumberFormat().format(data.tongThu - data.tongChi) +
                    " VND"}
                </span>
              </h4>
            </Col>
          </Row>
        ) : (
          ""
        )}
        <Row>
          {user && user.roleName === "Trader" && (
            <Col md="6">
              <h4 className="title-rp">{i18n.t("buyFish")}</h4>
            </Col>
          )}

          <Col md="6">
            <h4 className="title-rp">{i18n.t("sellFish")}</h4>
          </Col>
        </Row>

        <Row>
          {user && user.roleName === "Trader" && (
            <Col md="6" xs="12" className="rp-tb rp-left">
              {/* FOR PURCHASE */}

              <div className="under-title mb-3">
                <div className="under-title-line" />
              </div>

              {purchaseTotal.listSummaryPurchaseDetail.length > 0 ? (
                fTTable(purchaseTotal.listSummaryPurchaseDetail, user)
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

            <div className="under-title mb-3">
              <div className="under-title-line" />
            </div>
            {transactionTotal.listSummaryTransactionDetail.length > 0 ? (
              fTTable2(transactionTotal.listSummaryTransactionDetail, user)
            ) : (
              <div className="noData">
                <i className="fa fa-file-o mr-1" />
                {i18n.t("dataNotYet")}
              </div>
            )}
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
              <b>{el.pondOwner.id ? i18n.t("pondOwner") + ": " : ""}</b>
              {el.pondOwner ? el.pondOwner.name : i18n.t("noInfo")}
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
                    <Table.Summary.Cell key="1" colSpan="2" className="bold">
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
                        value={el.totalMoney && el.totalMoney.toFixed(0)}
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
                          value={el.totalMoney && el.totalMoney.toFixed(0)}
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
    title: i18n.t("buyPirce"),
    render: (cell, row) => (
      <Widgets.NumberFormat
        needSuffix={false}
        value={row.price / row.weight && (row.price / row.weight).toFixed(0)}
      />
    ),
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
      <Widgets.NumberFormat
        needSuffix={false}
        value={price && price.toFixed(0)}
      />
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
      <Widgets.NumberFormat
        needSuffix={false}
        value={sellPrice && sellPrice.toFixed(0)}
      />
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
