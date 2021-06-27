import React, { useState, useEffect } from "react";
import { Card, Table, Dropdown, Menu } from "antd";
// import { useSelector } from "react-redux";
import { Button, Row, Col } from "reactstrap";
import i18n from "i18next";
import ModalBuy from "./ModalBuy";
import ChoosePond from "./ChoosePond";
import Moment from "react-moment";
// import queryString from "queryString";
import queryString from "qs";
import local from "../../../../services/local";
import session from "../../../../services/session";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
// import dataDf from "../../../../data";
const BuyFish = (props) => {
  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isShowChoosePond, setShowChoosePond] = useState(true);
  const [Purchase, setPurchase] = useState({});
  const [currentPurchase, setCurrentPurchase] = useState({});
  const [transactions, setTrans] = useState([]);
  const [currentTran, setCurrentTran] = useState({});
  const [dataDf, setData] = useState({ basket: [], drum: [], truck: [] });

  const handelAction = (action, id) => {
    if (action === "delete") {
      let tem = transactions.filter((el) => el.id !== id);
      setTrans(tem);
    } else {
      let tem = transactions.find((e) => e.id === id);
      if (tem) {
        setCurrentTran(tem);
        setIsShowBuy(true);
      }
    }
  };
  const findLabel = (obj, key) => {
    return dataDf[obj].find((el) => el.id === parseInt(key)) || {};
  };

  const calculateIntoMoney = (idx) => {
    let tem = transactions.find((e) => e.idx === idx);
    let basket = dataDf.basket.find((el) => el.id === tem.basketId);
    if (tem) {
      let fishType = Purchase.arrFish.find((el, i) => idx === i) || {};
      return fishType.price * (parseInt(tem.weight) - basket.weight);
    }
  };

  // render button action like: edit, delete
  const renderBtnAction = (id) => {
    return (
      <Menu>
        <Menu.Item>
          <Button
            color="info"
            className="mr-2"
            onClick={() => handelAction("edit", id)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t("edit")}
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button color="danger" onClick={() => handelAction("delete", id)}>
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
      render: (idx) => <label>{idx}</label>,
    },
    {
      title: i18n.t("typeOfFish"),
      dataIndex: "typeOfFish",
      key: "typeOfFish",
      render: (typeOfFish) => (
        <div>
          {typeOfFish && (
            <label>{findLabel("fishType", typeOfFish).fishName}</label>
          )}
        </div>
      ),
    },
    {
      title: i18n.t("qtyOfFish(Kg)"),
      dataIndex: "weight",
      key: "weight",
      // responsive: ["lg"],
    },
    {
      title: i18n.t("intoMoney"),
      dataIndex: "idx",
      key: "idx",
      responsive: ["md", "lg"],
      render: (idx) => {
        debugger;
        return <div>{idx && <label>{calculateIntoMoney(idx)}</label>}</div>;
      },
    },
    {
      title: i18n.t("basket"),
      dataIndex: "basketId",
      render: (basketId) => (
        <div>
          {basketId && <label>{findLabel("basket", basketId).type}</label>}
        </div>
      ),
    },
    {
      title: i18n.t("drum"),
      dataIndex: "drum",
      key: "drum",
      render: (drum) => (
        <div>{drum && <label>{findLabel("drum", drum).label}</label>}</div>
      ),
    },
    {
      title: i18n.t("truck"),
      dataIndex: "truck",
      key: "truck",
      render: (truck) => (
        <div>{truck && <label>{findLabel("truck", truck).name}</label>}</div>
      ),
    },

    {
      title: i18n.t("action"),
      key: "id",
      dataIndex: "id",
      render: (id) => (
        <Dropdown overlay={renderBtnAction(id)}>
          <Button>
            <i className="fa fa-cog mr-1" />
            {i18n.t("action")}
          </Button>
        </Dropdown>
      ),
    },
  ];

  const showModal = () => {
    setIsShowBuy(true);
  };
  const handlePurchase = (value, prop) => {
    setPurchase((pre) => ({
      ...pre,
      [prop]: value,
    }));
  };
  const handleTrans = (value) => {
    setCurrentTran({});
    setTrans((pre) => [...pre, value]);
  };

  const findPO = () => {
    if (currentPurchase.pondOwner && dataDf.pondOwner)
      return (
        dataDf.pondOwner.find(
          (el) => el.id === parseInt(currentPurchase.pondOwner)
        ) || {}
      );
    else return {};
  };

  // fetch data
  async function fetchData() {
    try {
      let user = session.get("user");
      // get pondOwner by trarder ID
      let rs = await apis.getPondOwnerByTraderId({}, "GET", user.userID);
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          pondOwner: rs.data,
        }));
      }
      //get fish type trader id
      rs = await apis.getFTByTraderID({}, "GET");
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          fishType: rs.data,
        }));
      }
      //get truck trader id
      rs = await apis.getTruckByTrarderID({}, "GET");
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          truck: rs.data,
        }));
      }

      rs = await apis.getBasketByTraderId({}, "GET");
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          basket: rs.data,
        }));
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  // create purchase
  async function createPurchase() {
    try {
      let traderId = session.get("user").userID;
      let pondOwnerID = currentPurchase.pondOwner;
      let date = helper.getCurrentDate();

      let rs = await apis.createPurchase({ traderId, pondOwnerID, date });
      if (rs && rs.statusCode === 200) {
        let tem = rs.data;
        setPurchase((pre) => ({
          ...pre,
          tem,
        }));
        tem = Object.assign(tem, currentPurchase);
        local.set("currentPurchase", tem);
        // helper.toast("success", i18n.t(rs.statusCode));
      }
    } catch (error) {
      console.log(error);
    }
  }

  // createPurchaseDetail
  async function createPurchaseDetail(detail) {
    try {
      debugger;
      let rs = await apis.createPurchaseDetail({
        ...detail,
        purchaseId: currentPurchase.id,
      });
      if (rs && rs.statusCode === 200) {
        // let tem = rs.data;
        // setPurchase((pre) => ({
        //   ...pre,
        //   tem,
        // }));
        // tem = Object.assign(tem, currentPurchase);
        // local.set("currentPurchase", tem);
        helper.toast("success", i18n.t(rs.message));
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Get all purchase detail
  async function getAllPurchaseDetail(currentPurchase) {
    try {
      debugger;

      let rs = await apis.getAllPurchaseDetail({}, "GET", currentPurchase.id);
      if (rs && rs.statusCode === 200) {
        setTrans(rs.data);
        helper.toast("success", i18n.t(rs.message));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let query = queryString.parse(props.location.search, {
      ignoreQueryPrefix: true,
    });
    console.log(query);
    let tem = local.get("currentPurchase") || {};
    if (tem.pondOwner) {
      tem.pondOwner = parseInt(tem.pondOwner);
    }
    if (tem.id) {
      tem.id = parseInt(tem.id);
      setShowChoosePond(false);
      getAllPurchaseDetail(tem);
    }
    setCurrentPurchase(tem);
    fetchData();
  }, [props]);
  const renderTitle = () => {
    return (
      <Row>
        <Col md="3">
          <h3 className="mr-5">{i18n.t("Mua hàng")}</h3>
        </Col>
        <Col md="2">
          <Moment format="DD/MM/YYYY" className="mt-2">
            {currentPurchase.date}
          </Moment>
        </Col>
        <Col md="2">
          <label>
            <b>{i18n.t("pondOwner")}:</b>
            {findPO().name || ""}
          </label>
        </Col>
      </Row>
    );
  };
  if (isLoading) {
    return <div>loading...</div>;
  } else
    return (
      <div>
        {isShowBuy && (
          <ModalBuy
            isShowBuy={isShowBuy}
            setIsShowBuy={setIsShowBuy}
            currentPurchase={currentPurchase}
            transactions={transactions}
            handleTrans={handleTrans}
            currentTran={currentTran}
            dataDf={dataDf}
            createPurchaseDetail={createPurchaseDetail}
          />
        )}
        {isShowChoosePond && (
          <ChoosePond
            isShowChoosePond={isShowChoosePond}
            setShowChoosePond={setShowChoosePond}
            handlePurchase={handlePurchase}
            pondOwner={Purchase.pondOwner || ""}
            currentPurchase={currentPurchase}
            setCurrentPurchase={setCurrentPurchase}
            dataDf={dataDf}
            createPurchase={createPurchase}
          />
        )}
        {!isShowChoosePond && (
          <Card title={renderTitle()}>
            <Row className="mb-2">
              <Col span="24" className="">
                <div className="float-right">
                  <Button
                    color="info"
                    onClick={() => setShowChoosePond(true)}
                    className="mr-2"
                  >
                    {i18n.t("Giá cá hôm nay")}
                  </Button>
                  <Button color="info" onClick={showModal} className=" mr-2">
                    {i18n.t("Thêm Mã")}
                  </Button>
                </div>
              </Col>
            </Row>

            <Row>
              <Col style={{ overflowX: "auto" }}>
                <Table
                  columns={columns}
                  dataSource={transactions}
                  loading={isLoading}
                />
              </Col>
            </Row>
          </Card>
        )}
      </div>
    );
};

export default BuyFish;
