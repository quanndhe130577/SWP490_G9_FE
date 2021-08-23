import React, { useEffect, useState } from "react";
import { Card, Dropdown, Menu, Table } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import i18n from "i18next";
import LoadingCustom from "../../../containers/Antd/LoadingCustom";
import ChooseTraders from "./ChooseTraders";
import ModalSell from "./ModalSell";
import ModalCloseTransaction from "./ModalCloseSell";
import ModalBuyer from "./ModalPayment";
import queryString from "qs";
import { apis, helper, session } from "../../../services";

import NumberFormat from "react-number-format";
import Moment from "react-moment";
import moment from "moment";

const SellFish = (props) => {
  const history = useHistory();
  //loading & show modal
  const [isLoading, setLoading] = useState(false);
  const [isShowChooseTraders, setShowChooseTraders] = useState(false);
  const [isShowCloseTransaction, setShowCloseTrans] = useState(false);
  const [isShowSell, setShowSell] = useState(false);
  const [isShowBuyer, setShowBuyer] = useState(false);
  // data
  const [listTransaction, setListTransaction] = useState([]);
  const [listTransDetail, setListTransDetail] = useState([]);
  const [date, setDate] = useState("");

  const [currentTransaction, setCurrentTrans] = useState({});
  const [mode, setMode] = useState("create");
  const [user, setUser] = useState({});
  const [dataFetched, setDtFetched] = useState({}); // include trader by WR
  const [currentTraderId, setCurrentTraderId] = useState("");
  const [currentTransId, setCurrentTransId] = useState("");

  const handleBtnAction = (action, id) => {
    if (action === "delete") {
      deleteTransDetail({ transactionDetailId: id });
    } else {
      let tem = listTransDetail.find((e) => e.id === id);
      if (tem) {
        setCurrentTrans(tem);
        setShowSell(true);
        setMode("edit");
      }
    }
  };

  const handleChangeCurrentTrans = (pro, value) => {
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
      title: i18n.t("statusPaid"),
      dataIndex: "isPaid",
      key: "isPaid",
      render: (isPaid) => helper.tag(isPaid ? "isPaid" : "notPaid", "w-140px"),
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
        getAllTransByDate(date, user);
        setShowSell(false);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", error);
    }
  }
  async function updateTransDetail(data) {
    try {
      let rs = await apis.updateTransDetail(data);
      if (rs && rs.statusCode === 200) {
        getAllTransByDate(date, user);
        setShowSell(false);
        helper.toast("success", i18n.t(rs.message || "success"));
      }
    } catch (error) {
      console.log(error);
      helper.toast("error", error);
    }
  }
  async function deleteTransDetail(transactionDetailId) {
    try {
      helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
        if (rs) {
          let rs = await apis.deleteTransDetail(transactionDetailId);
          if (rs && rs.statusCode === 200) {
            getAllTransByDate(date, user);
            helper.toast("success", i18n.t(rs.message || "success"));
          }
        }
      });
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
      setUser(user);

      if (user.roleName !== "Trader") {
        await getTraderByWR();
      }

      await getAllTransByDate(date, user);

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
  async function createOneTrans() {
    // create  one transaction
    try {
      let rs = await apis.createOneTrans({
        date: helper.correctDate(new Date()),
      });
      if (rs && rs.statusCode === 200) {
        // helper.toast("success", i18n.t(rs.message || "success"));
        history.push(
          "sellFish?date=" + helper.getDateFormat(new Date(), "ddmmyyyy")
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function getAllTransByDate(date, user, isDelete) {
    try {
      let rs = await apis.getTransByDate({}, "GET", date);
      if (rs && rs.statusCode === 200) {
        // IS DATA NULL
        if (rs.data.length === 0) {
          // IS DELETE TRANS MODE
          if (isDelete) {
            handleBack();
          } else {
            // IS NOT DELETE TRANS MODE
            if (user.roleName !== "Trader") setShowChooseTraders(true);
            else {
              setShowChooseTraders(false);
              createOneTrans();
            }
          }
        } else {
          let tem = [],
            temTransDetail = [],
            listTraderId = [],
            tranTuBan = "";
          for (const trans of rs.data) {
            trans.transactionDetails.map((el) => (el.trader = trans.trader));
            temTransDetail = temTransDetail.concat(trans.transactionDetails);
            trans.trader.transId = trans.id;
            tem.push(trans.trader);
            listTraderId.push(trans.trader.id);
            if (user.roleName === "Trader" && !trans.weightRecorder) {
              tranTuBan = trans.id;
            }
          }
          handleChangeCurrentTrans("listTraderId", listTraderId);
          setListTransDetail(temTransDetail);
          setListTransaction(rs.data);
          // setRealDate(rs.data[0].date);

          setDtFetched((pro) => ({ ...pro, tradersSelected: tem, tranTuBan }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handleBack() {
    history.push("/sell");
  }

  const renderTitleTable = (trans) => {
    let client = "trader";
    if (user.roleName === "Trader") {
      client = "weightRecorder";
    }
    if (trans)
      return (
        <div className="mb-2">
          <span className="mr-3">
            {trans[client] && (
              <>
                <b>{i18n.t(client)}: </b>
                {trans[client].firstName + " " + trans[client].lastName}
              </>
            )}
          </span>
          {trans.transactionDetails.length > 0 && (
            <span className="mr-3">
              <b> {i18n.t("totalWR")}:</b> {trans.transactionDetails.length}
            </span>
          )}
          <span className="pull-right mb-2">
            {showBtnDelete(trans) === "delete" ? (
              <Button
                color="danger"
                onClick={(e) =>
                  // deleteTrans({ transactionId: trans.trader.transId })
                  deleteTrans({ transactionId: trans.id })
                }
              >
                <i className="fa fa-trash mr-1" />
                {i18n.t("deleteTrans")}
              </Button>
            ) : (
              showBtnDelete(trans) === "Completed" && (
                <Button
                  color="info"
                  onClick={() => {
                    setCurrentTransId(trans.id);
                    if (trans.weightRecorder)
                      setCurrentTraderId(trans.trader.id);
                    setShowCloseTrans(true);
                  }}
                >
                  <i className="fa fa-info-circle mr-1" />
                  {i18n.t("viewDetail")}
                </Button>
              )
            )}
          </span>
        </div>
      );
  };
  function showBtnDelete(trans) {
    // status === pending
    if (trans.status === "Pending") {
      if (user.roleName === "WeightRecorder") {
        return "delete";
      } else if (user.roleName === "Trader") {
        if (trans.weightRecorder) {
          return "";
        }
        return "delete";
      }
    } else if (trans.status === "Completed") {
      return "Completed";
    }
  }
  async function deleteTrans(transactionId) {
    try {
      helper.confirm(i18n.t("confirmDelete")).then(async (res) => {
        if (res) {
          let rs = await apis.deleteTrans(transactionId);
          if (rs && rs.statusCode === 200) {
            getAllTransByDate(date, user, true);
            helper.toast("success", i18n.t(rs.message || "success"));
          }
        }
      });
    } catch (error) {
      console.log(error);
      helper.toast("error", error);
    }
  }
  const calculateColumns = (col, trans) => {
    let temCol = [...col];
    if (
      (trans && trans.weightRecorder && user.roleName === "Trader") ||
      trans.status === "Completed"
    )
      temCol.pop();
    return temCol;
  };
  const handleCloseTrans = async (data) => {
    try {
      let rs = await apis.closeTrans(data);
      if (rs && rs.statusCode === 200) {
        helper.toast("success", i18n.t(rs.message || "success"));
        setShowCloseTrans(false);
        getAllTransByDate(date, user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkSession = () => {
    let isPending = listTransaction.find((el) => el.status === "Pending");
    if (listTransaction.length > 0) {
      if (isPending) {
        return true;
      }
      let dateTrans = helper.getDateFormat(listTransaction[0].date, "ddmmyyyy");
      let dateToday = new Date();
      let hourToday = moment(dateToday).format("HH");
      if (parseInt(hourToday) <= 0) {
        dateToday = moment(dateToday).subtract(1, "days");
      }
      dateToday = helper.getDateFormat(dateToday, "ddmmyyyy");
      return dateToday === dateTrans;
    }
    return true;
  };
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
          <h3 className="mr-5">
            {i18n.t("transactionDetail.Title")} -
            <label className="mr-2">
              {/* <b>{i18n.t("date")}:</b> */}
              <Moment format="DD/MM/YYYY" className="ml-2">
                {listTransaction.length > 0
                  ? listTransaction[0].date
                  : new Date()}
              </Moment>
            </label>
          </h3>
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
        {isShowCloseTransaction && (
          <ModalCloseTransaction
            listTransaction={listTransaction}
            dataDf={dataFetched || []}
            date={date}
            isShowCloseTransaction={isShowCloseTransaction}
            handleCloseModal={() => {
              setShowCloseTrans(false);
              setCurrentTraderId("");
              setCurrentTransId("");
              setCurrentTrans({});
            }}
            handleCloseTrans={handleCloseTrans}
            traderId={currentTraderId}
            handleChangeTraderId={() => {
              setCurrentTraderId("");
              setCurrentTransId("");
            }}
            transId={currentTransId || ""}
          />
        )}
        {isShowChooseTraders && user.roleName !== "Trader" && (
          <ChooseTraders
            dataFetched={dataFetched}
            isShowChooseTraders={isShowChooseTraders}
            currentTransaction={currentTransaction}
            handleChangeCurrentTrans={handleChangeCurrentTrans}
            setShowChooseTraders={(status) => setShowChooseTraders(status)}
            date={date}
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
            updateTransDetail={updateTransDetail}
            deleteTransDetail={deleteTransDetail}
            date={date}
          />
        )}
        {isShowBuyer && (
          <ModalBuyer
            isShowBuyer={isShowBuyer}
            setShowBuyer={(state) => setShowBuyer(state)}
            date={date}
            getAllTransByDate={(date) => getAllTransByDate(date, user)}
          />
        )}
        {!isShowChooseTraders && (
          <Card title={renderTitle()} className="body-minH">
            {/* ROW BUTTON */}
            <Row className="mb-4" style={{ minHeight: "6vh" }}>
              <Col md="4" />

              {user.roleName === "Trader" && (
                <Col md="2" className="p-0 pr-2" />
              )}
              {checkSession() ? (
                <>
                  <Col md="2" xs="6" className="p-0 pr-2">
                    <Button
                      color="info"
                      onClick={() => {
                        setShowCloseTrans(true);
                        setCurrentTransId(dataFetched.tranTuBan);
                      }}
                      className="w-100 p-0 h-100"
                    >
                      <i className="fa fa-check-square-o mr-1" />
                      {i18n.t("closeTransaction")}
                    </Button>
                  </Col>

                  <Col md="2" xs="6" className="p-0 pr-2">
                    <Button
                      color="info"
                      onClick={() => {
                        setShowBuyer(true);
                      }}
                      className="w-100 p-0 h-100"
                    >
                      <i className="fa fa-shopping-cart mr-1" />
                      {i18n.t("payment")}
                    </Button>
                  </Col>
                  {user.roleName !== "Trader" && (
                    <Col md="2" xs="6" className="p-0 pr-2">
                      <Button
                        color="info"
                        onClick={() => setShowChooseTraders(true)}
                        className="w-100 p-0 h-100"
                      >
                        <i className="fa fa-user-plus mr-1" />
                        {i18n.t("choseTrader")}
                      </Button>
                    </Col>
                  )}

                  <Col md="2" xs="6" className="p-0 pr-3">
                    <Button
                      color="info"
                      onClick={() => {
                        setShowSell(true);
                        setCurrentTrans({});
                        setMode("create");
                      }}
                      className="w-100 p-0 h-100 bold"
                    >
                      <i className="fa fa-plus mr-1" />
                      {i18n.t("Thêm Mã Bán")}
                    </Button>
                  </Col>
                </>
              ) : (
                <>
                  <Col md="10" />
                  <Col md="2" xs="6" className="p-0 pr-2">
                    <Button
                      color="info"
                      onClick={() => {
                        setShowBuyer(true);
                      }}
                      className="w-100 p-0 h-100"
                    >
                      <i className="fa fa-shopping-cart mr-1" />
                      {i18n.t("payment")}
                    </Button>
                  </Col>
                </>
              )}
            </Row>

            <Row>
              <Col style={{ overflowX: "auto" }}>
                {listTransaction.map((trans, idx) => (
                  <div className="mb-5" key={idx}>
                    {/* render label trader, wr, btn delete trans */}
                    {renderTitleTable(trans)}
                    <Table
                      key={idx + trans.id}
                      rowKey="id"
                      columns={calculateColumns(columns, trans)}
                      dataSource={trans.transactionDetails || []}
                      loading={isLoading}
                      scroll={{ y: 520 }}
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
                                className="bold text-center"
                              >
                                {i18n.t("total")}
                              </Table.Summary.Cell>
                              <Table.Summary.Cell
                                key="2"
                                className="bold"
                                colSpan="2"
                              >
                                <NumberFormat
                                  value={totalWeight.toFixed(1)}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell key="4" className="bold">
                                <NumberFormat
                                  value={totalAmount}
                                  displayType={"text"}
                                  thousandSeparator={true}
                                />
                              </Table.Summary.Cell>
                              <Table.Summary.Cell
                                key="5"
                                colSpan="4"
                                className="bold"
                              >
                                {trans.status === "Completed"
                                  ? helper.tag(trans.status, "w-120px")
                                  : ""}
                              </Table.Summary.Cell>
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
