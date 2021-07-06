import React, { useEffect, useState } from "react";
import { Card, Dropdown, Menu, Table } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import i18n from "i18next";
import ModalBuy from "./ModalBuy";
import ChoosePond from "./ChoosePond";
import queryString from "qs";
import local from "../../../../services/local";
import session from "../../../../services/session";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
// import moment from "moment";

const BuyFish = (props) => {
  const history = useHistory();
  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isShowChoosePond, setShowChoosePond] = useState(true);
  const [purchase, setPurchase] = useState([]);
  const [mode, setMode] = useState("");
  const [currentPurchase, setCurrentPurchase] = useState({});
  const [dataDf, setData] = useState({ basket: [], drum: [], truck: [] }); // list data of basket, drum, truck,...
  const currentPurchasePROPS = useSelector(
    (state) => state.purchase.currentPurchase,
  ); // data in redux

  const handleAction = (action, id) => {
    if (action === "delete") {
      deletePurchaseDetail(id);
    } else {
      let tem = purchase.find((e) => e.id === id);
      if (tem) {
        setMode("edit")
        setCurrentPurchase(tem);
        setIsShowBuy(true);
      }
    }
  };

  // deletePurchaseDetail
  async function deletePurchaseDetail(purchaseDetailId) {
    try {
      let rs = await apis.deletePurchaseDetail({ purchaseDetailId });
      if (rs && rs.statusCode === 200) {
        let tem = purchase.filter((el) => el.id !== purchaseDetailId);
        setPurchase(tem);
        helper.toast("success", i18n.t(rs.message));
      }
    } catch (error) {
      console.log(error);
      helper.toast("success", i18n.t(error));
    }
  }

  const renderDrum = (listDrum = []) => {
    let label = "";
    listDrum.forEach((el, idx) => {
      label += el.number;
      if (idx < listDrum.length - 1) {
        label += " - ";
      }
    });
    return label;
  };

  const calculateIntoMoney = (id) => {
    let tem = purchase.find((e) => e.id === id);
    // let basket = dataDf.basket.find((el) => el.id === tem.basketId);
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
        <Menu.Item>
          <Button
            color="info"
            className="mr-2"
            onClick={() => handleAction("edit", id)}
          >
            <i className="fa fa-pencil-square-o mr-1" />
            {i18n.t("edit")}
          </Button>
        </Menu.Item>
        <Menu.Item>
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
      render: (idx) => <label>{idx}</label>,
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
      title: i18n.t("intoMoney"),
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
      title: i18n.t("drum"),
      dataIndex: "listDrum",
      key: "listDrum",
      render: (listDrum) => renderDrum(listDrum),
    },
    {
      title: i18n.t("truck"),
      dataIndex: "truck",
      key: "truck",
      render: (truck) => <div>{truck && <label>{truck.name}</label>}</div>,
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

  // const showModal = () => {
  //   setIsShowBuy(true);
  // };

  const  handleAddBaskest=()=>{
    setMode("create")
    setIsShowBuy(true)
  }

  const handlePurchase = (value) => {
    // setCurrentTran({});
    setCurrentPurchase({});
    setPurchase((pre) => [...pre, value]);
  };

  const findPO = () => {
    if (currentPurchase.pondOwner && dataDf.pondOwner)
      return (
        dataDf.pondOwner.find(
          (el) => el.id === parseInt(currentPurchase.pondOwner),
        ) || {}
      );
    else return {};
  };

  // fetch data
  async function fetchData() {
    try {
      let user = session.get("user");
      getPondOwnerByTraderId(user.userID);
      getFTByTraderID();
      getTruckByTrarderID();
      getBasketByTraderId();

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function getBasketByTraderId(userID) {
    try {
      let rs = await apis.getBasketByTraderId({}, "GET");
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          basket: rs.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getFTByTraderID() {
    try {
      //get fish type trader id
      let rs = await apis.getFTByTraderID({}, "GET");
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          fishType: rs.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getTruckByTrarderID(userID) {
    try {
      //get truck trader id
      let rs = await apis.getTruckByTrarderID({}, "GET");
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          truck: rs.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getPondOwnerByTraderId(userID) {
    try {
      // get pondOwner by trarder ID
      let rs = await apis.getPondOwnerByTraderId({}, "GET", userID);
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          pondOwner: rs.data,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }


  async function fetchDrumByTruck(truckId) {
    try {
      let rs = await apis.getAllDrumByTruckID({}, "GET", truckId);
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          drum: rs.data,
        }));
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
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
        tem = Object.assign(tem, currentPurchase);
        setCurrentPurchase(tem);
        local.set("currentPurchase", tem);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // createPurchaseDetail
  async function createPurchaseDetail(detail) {
    try {
      let { fishTypeId, basketId, weight, listDrumId = [] } = detail;
      let rs = await apis.createPurchaseDetail({
        fishTypeId,
        basketId,
        weight,
        listDrumId,
        purchaseId: currentPurchase.id,
      });
      if (rs && rs.statusCode === 200) {
        getAllPurchaseDetail(detail);
        helper.toast("success", i18n.t(rs.message));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsShowBuy(false);
    }
  }

  // Get all purchase detail
  async function getAllPurchaseDetail(currentPurchase) {
    try {
      setLoading(true);
      let rs = await apis.getAllPurchaseDetail({}, "GET", currentPurchase.id);
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        setPurchase(rs.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function closePurchase() {
  }

  function handleBack() {
    history.push("/buy");

  }

  useEffect(() => {
    // lấy id trên address bar
    let query = queryString.parse(props.location.search, {
      ignoreQueryPrefix: true,
    });

    if (query && query.id) {
      query.id = parseInt(query.id);
    }

    let tem = local.get("currentPurchase") || query;
    if (tem.pondOwner) {
      tem.pondOwner = parseInt(tem.pondOwner);
    }

    if (tem.status === "Pending") {
      tem = {};
      local.set("currentPurchase", tem);
    }

    if (tem.id || query.id) {
      // nếu có id thì ko show modal ChoosePond
      // và get getAllPurchaseDetail theo id ban đâu
      tem.id = parseInt(tem.id);
      setShowChoosePond(false);

      // Object.assign(tem, currentPurchasePROPS);
      Object.assign(tem, local.get("historyPurchase"));

      getAllPurchaseDetail(tem || query);
    } else {
      setShowChoosePond(true);
    }
    setCurrentPurchase(tem);

    fetchData();
    // eslint-disable-next-line
  }, [props, currentPurchasePROPS]);

  const renderTitle = () => {
    return (
      <Row>
        <Col md="6">
          <h3 className="mr-5">{i18n.t("buyGood")}</h3>
        </Col>
        <Col md="6">
          <Button className="pull-right" color={"danger"} onClick={() => handleBack()}>
            <i className="fa fa-arrow-left mr-1" />
            {i18n.t("back")}
          </Button>
        </Col>
        {/*<Col md="2">*/}
        {/*  <Moment format="DD/MM/YYYY" className="mt-2">*/}
        {/*    {currentPurchase.date}*/}
        {/*  </Moment>*/}
        {/*</Col>*/}
        {/*<Col md="2">*/}
        {/*  <label>*/}
        {/*    <b>{i18n.t("pondOwner")}:</b>*/}
        {/*    /!* nếu ko có id thì dùng hàm findPO  *!/*/}
        {/*    {findPO().name || currentPurchase.pondOwnerName}*/}
        {/*  </label>*/}
        {/*</Col>*/}
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
            purchase={purchase}
            handlePurchase={handlePurchase}
            dataDf={dataDf}
            createPurchaseDetail={createPurchaseDetail}
            fetchDrumByTruck={fetchDrumByTruck}
            mode={mode}
          />
        )}
        {isShowChoosePond && (
          <ChoosePond
            isShowChoosePond={isShowChoosePond}
            setShowChoosePond={setShowChoosePond}
            handlePurchase={handlePurchase}
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
                {/* nếu status khac Pending thì ko show btn thêm */}
                {currentPurchase.status === "Pending" && (
                  <div className="float-right">
                    <Button
                      color="info"
                      onClick={() => closePurchase()}
                      className="mr-2"
                    >
                      {i18n.t("closePurchase")}
                    </Button>
                    <Button
                      color="info"
                      onClick={() => setShowChoosePond(true)}
                      className="mr-2"
                    >
                      {i18n.t("Giá cá hôm nay")}
                    </Button>
                    <Button color="info" onClick={handleAddBaskest} className=" mr-2">
                      {i18n.t("Thêm Mã")}
                    </Button>
                  </div>
                )}
              </Col>
            </Row>

            <Row>
              <Col style={{ overflowX: "auto" }}>
                <Table
                  columns={columns}
                  dataSource={purchase}
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
