import React, { useEffect, useState } from "react";
import { Card, Dropdown, Menu, Table } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import i18n from "i18next";
import LoadingCustom from "../../../containers/Antd/LoadingCustom";
// import ModalClosetransaction from "./ModalClosetransaction";
import ChooseTraders from "./ChooseTraders";
import ModalSell from "./ModalSell";
import queryString from "qs";

import { apis, session } from "../../../services";

import NumberFormat from "react-number-format";
// import { useSelector } from "react-redux";
import Moment from "react-moment";

const SellFish = (props) => {
  const history = useHistory();

  const [isLoading, setLoading] = useState(false);
  const [isShowChooseTraders, setShowChooseTraders] = useState(false);
  const [isShowSell, setShowSell] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const [currentTransaction, setCurrentTrans] = useState({});
  // const [mode, setMode] = useState("");
  const [dataFetched, setDtFetched] = useState({}); // include trader by WR

  // const currentTransactionPROPS = useSelector(
  //   (state) => state.transaction.currentTransaction
  // ); // data in redux

  const handleAction = (action, id) => {
    if (action === "delete") {
      // deletetransactionDetail(id);
    } else {
      let tem = transaction.find((e) => e.id === id);
      if (tem) {
        tem.transactionDetailId = id;
        // setMode("edit");
      }
    }
  };

  const handleChangeTrans = (pro, value) => {
    setCurrentTrans((preStates) => ({ ...preStates, [pro]: value }));
  };
  const calculateIntoMoney = (id) => {
    let tem = transaction.find((e) => e.id === id);
    if (tem && tem.fishType) {
      let value =
        tem.fishType.price * (parseInt(tem.weight) - tem.basket.weight);
      return (
        <NumberFormat
          value={value}
          displayType={"text"}
          thousandSeparator={true}
          // suffix={i18n.t("suffix")}
        />
      );
    }
  };

  // render button action like: edit, delete
  const renderBtnAction = (id) => {
    return (
      <Menu>
        <Menu.Item key="1">
          <Button
            color="info"
            className="mr-2"
            onClick={() => handleAction("edit", id)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t("edit")}
          </Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button color="danger" onClick={() => handleAction("delete", id)}>
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
      dataIndex: "idx",
      key: "idx",
      width: 60,
      render: (idx) => <label className="antd-tb-idx">{idx}</label>,
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
      title: i18n.t("qtyOfFish(Kg)"),
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: (
        <div>
          <label>{i18n.t("intoMoney")}</label>
          <label>({i18n.t("temporary")})</label>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      responsive: ["md", "lg"],
      render: (id) => {
        return <div>{id && <label>{calculateIntoMoney(id)}</label>}</div>;
      },
    },
    {
      title: i18n.t("basket"),
      dataIndex: "basket",
      render: (basket) => <div>{basket && <label>{basket.type}</label>}</div>,
    },
    {
      title: i18n.t("trader"),
      dataIndex: "trader",
      key: "trader",
    },
    {
      title: i18n.t("buyer"),
      dataIndex: "buyer",
      key: "buyer",
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

  // fetch data
  async function fetchData() {
    try {
      setLoading(true);
      let user = session.get("user");
      setDtFetched((preProps) => ({ ...preProps, currentWR: user }));
      getAllTransaction();
      getTraderByWR();
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
  async function getAllTransaction() {
    try {
      let rs = await apis.getAllTransaction();
      if (rs && rs.statusCode === 200) {
        setTransaction(transaction);
        // setDtFetched((preProps) => ({ ...preProps, traders: rs.data }));
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handleBack() {
    history.push("/sell");
  }

  useEffect(() => {
    // lấy id trên address bar
    let query = queryString.parse(props.location.search, {
      ignoreQueryPrefix: true,
    });

    if (query && query.id) {
      query.id = parseInt(query.id);
    }

    fetchData();
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
            dataDf={[]}
          />
        )}
        {!isShowChooseTraders && (
          <Card title={renderTitle()}>
            <Row className="mb-2">
              <Col md="6">
                <label className="mr-2">
                  <b>{i18n.t("date")}:</b>
                  <Moment format="DD/MM/YYYY" className="ml-2"></Moment>
                </label>
                <label></label>
              </Col>
              <Col md="6">
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
              </Col>
            </Row>

            <Row>
              <Col style={{ overflowX: "auto" }}>
                <Table
                  columns={columns}
                  dataSource={transaction}
                  loading={isLoading}
                  scroll={{ y: 420 }}
                  pagination={{ pageSize: 100 }}
                  bordered
                  // summary={(pageData) => {
                  //   let totalWeight = 0;
                  //   let totalAmount = 0;
                  //   pageData.forEach(({ weight, fishType, basket }) => {
                  //     totalWeight += weight;
                  //     totalAmount +=
                  //       fishType.price * (parseInt(weight) - basket.weight);
                  //   });

                  //   return (
                  //     <Table.Summary fixed>
                  //       <Table.Summary.Row>
                  //         <Table.Summary.Cell
                  //           colSpan="2"
                  //           key="1"
                  //           className="bold"
                  //         >
                  //           {i18n.t("total")}
                  //         </Table.Summary.Cell>
                  //         <Table.Summary.Cell key="2">
                  //           <NumberFormat
                  //             value={totalWeight.toFixed(1)}
                  //             displayType={"text"}
                  //             thousandSeparator={true}
                  //             suffix=" Kg"
                  //           />
                  //         </Table.Summary.Cell>
                  //         <Table.Summary.Cell key="3">
                  //           <NumberFormat
                  //             value={totalAmount}
                  //             displayType={"text"}
                  //             thousandSeparator={true}
                  //             suffix={i18n.t("suffix")}
                  //           />
                  //         </Table.Summary.Cell>
                  //         <Table.Summary.Cell colSpan="4" key="4" />
                  //       </Table.Summary.Row>
                  //     </Table.Summary>
                  //   );

                  // }}
                />
              </Col>
            </Row>
          </Card>
        )}
      </div>
    );
};

export default SellFish;
