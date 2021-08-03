import React, { useEffect, useState } from "react";
import { Card, Dropdown, Menu, Table } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import i18n from "i18next";
import LoadingCustom from "../../../containers/Antd/LoadingCustom";
import ChooseTraders from "./ChooseTraders";
import ModalSell from "./ModalSell";
import queryString from "qs";
import { apis, helper, session } from "../../../services";

import NumberFormat from "react-number-format";
import Moment from "react-moment";

const SellFish = (props) => {
  const history = useHistory();
  //loading & show modal
  const [isLoading, setLoading] = useState(false);
  const [isShowChooseTraders, setShowChooseTraders] = useState(false);
  const [isShowSell, setShowSell] = useState(false);
  // data
  const [listTransDetail, setListTransDetail] = useState([]);
  const [date, setDate] = useState("");
  // const [listTrans, setListTrans] = useState([]);
  const [currentTransaction, setCurrentTrans] = useState({});
  const [mode, setMode] = useState("create");

  // const [traderInDate, setTraderInDate] = useState([]);
  const [dataFetched, setDtFetched] = useState({}); // include trader by WR

  const handleBtnAction = (action, id) => {
    if (action === "delete") {
      // deletetransactionDetail(id);
    } else {
      debugger;
      let tem = listTransDetail.find((e) => e.id === id);
      if (tem) {
        tem.transactionDetailId = id;
        setMode("edit");
      }
    }
  };

  const handleChangeTrans = (pro, value) => {
    setCurrentTrans((preStates) => ({ ...preStates, [pro]: value }));
  };
  const calculateIntoMoney = ({ sellPrice, weight }) => (
    <NumberFormat
      value={sellPrice * weight}
      displayType={"text"}
      thousandSeparator={true}
    />
  );

  // render button action like: edit, delete
  const renderBtnAction = (id) => {
    return (
      <Menu>
        <Menu.Item key="1">
          <Button
            color="info"
            className="mr-2"
            onClick={() => handleBtnAction("edit", id)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t("edit")}
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button color="danger" onClick={() => handleBtnAction("delete", id)}>
            <i className="fa fa-trash-o mr-1" />
            {i18n.t("delete")}
          </Button>
        </Menu.Item>
      </Menu>
    );
  };

  // columns in table
  const columns = [
    {
      title: "STT",
      width: 60,
      render: (el, row, idx) => (
        <label className="antd-tb-idx">{idx + 1}</label>
      ),
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
      title: i18n.t("statusPaid"),
      dataIndex: "isPaid",
      key: "isPaid",
      render: (isPaid) => <span>{i18n.t(isPaid ? "isPaid" : "notPaid")}</span>,
    },
    {
      title: i18n.t("buyer"),
      dataIndex: "buyer",
      key: "buyer",
      render: (buyer) => {
        return (
          <div>{buyer && buyer ? buyer.name : i18n.t("retailCustomers")}</div>
        );
      },
    },

    {
      title: i18n.t("action"),
      key: "id",
      dataIndex: "id",
      render: (id) => (
        <Dropdown overlay={renderBtnAction(id)}>
          <Button>
            <i className="fa fa-cog mr-1" />
            <label className="tb-lb-action">{i18n.t("action")}</label>
          </Button>
        </Dropdown>
      ),
    },
  ];
  //create purchase detail
  async function createTransDetail(data) {
    try {
      let rs = await apis.createTranDetail(data);
      if (rs && rs.statusCode === 200) {
        helper.toast("success", i18n.t(rs.message));
        getAllTransByDate(date);
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", error);
    }
  }
  // fetch data
  async function fetchData(date) {
    try {
      setLoading(true);
      let user = session.get("user");
      setDtFetched((preProps) => ({ ...preProps, currentWR: user }));
      if (date) {
        await getAllTransByDate(date);
      } else {
        await getTraderByWR();
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function getTraderByWR() {
    try {
      let rs = await apis.getTraderByWR({}, "GET");
      if (rs && rs.statusCode === 200) {
        setDtFetched((preProps) => ({ ...preProps, traders: rs.data }));
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllTransByDate(date) {
    try {
      let rs = await apis.getTransByDate({}, "GET", date);
      if (rs && rs.statusCode === 200) {
        // setListTransDetail(rs.data);
        let tem = [];
        for (const trans of rs.data) {
          trans.trader.transId = trans.id;
          tem.push(trans.trader);
        }
        // setTraderInDate(tem);
        setListTransDetail(rs.data);

        setDtFetched((pro) => ({ ...pro, traders: tem }));
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handleBack() {
    history.push("/sell");
  }

  useEffect(() => {
    let query = queryString.parse(props.location.search, {
      ignoreQueryPrefix: true,
    });

    let date;
    if (query && query.date) {
      date = query.date;
      setDate(date);
    }
    fetchData(date);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const renderTitle = () => {
    return (
      <Row>
        <Col md="6">
          <h3 className="mr-5">{i18n.t("sellGood")}</h3>
        </Col>
        <Col md="6">
          <Button
            className="pull-right"
            color={"danger"}
            onClick={() => handleBack()}
          >
            <i className="fa fa-arrow-left mr-1" />
            {i18n.t("back")}
          </Button>
        </Col>
      </Row>
    );
  };
  if (isLoading) {
    return <LoadingCustom />;
  } else
    return (
      <div>
        {isShowChooseTraders && (
          <ChooseTraders
            dataFetched={dataFetched}
            isShowChooseTraders={isShowChooseTraders}
            currentTransaction={currentTransaction}
            handleChangeTrans={handleChangeTrans}
            setShowChooseTraders={(status) => setShowChooseTraders(status)}
          />
        )}
        {isShowSell && (
          <ModalSell
            isShowSell={isShowSell}
            setShowSell={(state) => setShowSell(state)}
            currentTransaction={currentTransaction || {}}
            dataDf={dataFetched || []}
            mode={mode}
            createTransDetail={createTransDetail}
            date={date}
          />
        )}
        {!isShowChooseTraders && (
          <Card title={renderTitle()} style={{ minHeight: "80vh" }}>
            <Row className="mb-2">
              <Col md="6">
                <label className="mr-2">
                  <b>{i18n.t("date")}:</b>
                  <Moment format="DD/MM/YYYY" className="ml-2">
                    {listTransDetail.length > 0
                      ? listTransDetail[0].date
                      : new Date()}
                  </Moment>
                </label>
              </Col>
              {/* <Col md="6">
                <div className="float-right">
                  <Button
                    color="info"
                    // onClick={() => handleClosetransaction()}
                    className="mr-2"
                  >
                    {i18n.t("closetransaction")}
                  </Button>
                  <Button
                    color="info"
                    onClick={() => setShowChooseTraders(true)}
                    className="mr-2"
                  >
                    {i18n.t("choseTrader")}
                  </Button>
                  <Button
                    color="info"
                    onClick={() => setShowSell(true)}
                    className=" mr-2"
                  >
                    {i18n.t("Thêm Mã")}
                  </Button>
                </div>
              </Col> */}
              <Col md="2" xs="6">
                <Button
                  color="info"
                  // onClick={() => handleClosetransaction()}
                  className="float-right"
                >
                  {i18n.t("close transaction")}
                </Button>
              </Col>
              <Col md="2" xs="6">
                <Button
                  color="info"
                  onClick={() => setShowChooseTraders(true)}
                  className="float-right"
                >
                  {i18n.t("choseTrader")}
                </Button>
              </Col>

              <Col md="2" xs="6">
                <Button
                  color="info"
                  onClick={() => setShowSell(true)}
                  className="float-right"
                >
                  {i18n.t("Thêm Mã Bán")}
                </Button>
              </Col>
            </Row>

            <Row>
              <Col style={{ overflowX: "auto" }}>
                {listTransDetail.map((trans, idx) => (
                  <div className="mb-5">
                    <b>
                      <span className="mr-2">
                        {i18n.t("trader")}:{" "}
                        {trans.trader && trans.trader.lastName}.
                      </span>
                      {trans.transactionDetails.length > 0 && (
                        <span className="mr-2">
                          {i18n.t("totalWR")}: {trans.transactionDetails.length}
                        </span>
                      )}
                    </b>
                    <Table
                      key={idx + trans.id}
                      columns={columns}
                      dataSource={trans.transactionDetails || []}
                      loading={isLoading}
                      scroll={{ y: 420 }}
                      pagination={{ pageSize: 10 }}
                      bordered
                      summary={(pageData) => {
                        let totalWeight = 0;
                        let totalAmount = 0;
                        pageData.forEach(({ weight, sellPrice }) => {
                          totalWeight += weight;
                          totalAmount += weight * sellPrice;
                        });

                        return (
                          <Table.Summary fixed>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                colSpan="2"
                                key="1"
                                className="bold"
                              >
                                {i18n.t("total")}
                              </Table.Summary.Cell>
                              <Table.Summary.Cell key="2">
                                <NumberFormat
                                  value={totalWeight.toFixed(1)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell key="3" />
                              <Table.Summary.Cell key="4">
                                <NumberFormat
                                  value={totalAmount}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell key="5" />
                              <Table.Summary.Cell colSpan="4" key="4" />
                            </Table.Summary.Row>
                          </Table.Summary>
                        );
                      }}
                    />
                  </div>
                ))}
              </Col>
            </Row>
          </Card>
        )}
      </div>
    );
};

export default SellFish;
