import React, { useEffect, useState } from "react";
import { Card, Dropdown, Menu, Table } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Col, Row } from "reactstrap";
import i18n from "i18next";
import ModalBuy from "./ModalBuy";
import ModalClosePurchase from "./ModalClosePurchase";
import ChoosePond from "./ChoosePond";
import queryString from "qs";
import services from "../../../../services";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import _ from "lodash";
import Item from "antd/lib/list/Item";
import Widgets from "../../../../schema/Widgets";

const { local, session, apis, helper } = services;

const BuyFish = (props) => {
  const history = useHistory();
  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isShowChoosePond, setShowChoosePond] = useState(true);
  const [purchase, setPurchase] = useState([]);
  const [mode, setMode] = useState("");
  const [currentPurchase, setCurrentPurchase] = useState({});
  const [suggestionPurchase, setSuggestionPurchase] = useState(null); //purchase dung de goi y khi them purchase detail
  const [dataDf, setData] = useState({
    basket: [],
    drum: [],
    truck: [],
    fishType: [],
  }); // list data of basket, drum, truck,...
  const [isShowClosePurchase, setShowClosePurchase] = useState(false);
  // const [currentListFishTyppe, setCurrentListFishTyppe] = useState([]);
  // const [query, setQuery] = useState({});
  const currentPurchasePROPS = useSelector(
    (state) => state.purchase.currentPurchase
  ); // data in redux

  const handleAction = (action, id) => {
    if (currentPurchase.status && currentPurchase.status === "Pending") {
      if (action === "delete") {
        deletePurchaseDetail(id);
      } else {
        let tem = purchase.find((e) => e.id === id);
        if (tem) {
          tem.id = currentPurchase.id;
          tem.purchaseDetailId = id;
          //tem.purchaseId = currentPurchase.id;
          setMode("edit");
          setCurrentPurchase(Object.assign(currentPurchase, tem));
          setIsShowBuy(true);
        }
      }
    } else {
      helper.toast("error", i18n.t("youCanDoActionWhenCompleted"));
    }
  };

  // deletePurchaseDetail
  async function deletePurchaseDetail(purchaseDetailId) {
    try {
      setLoading(true);
      let rs = await apis.deletePurchaseDetail({ purchaseDetailId });
      if (rs && rs.statusCode === 200) {
        let tem = purchase.filter((el) => el.id !== purchaseDetailId);
        setPurchase(tem);
        helper.toast("success", i18n.t(rs.message));
      }
    } catch (error) {
      console.log(error);
      helper.toast("success", i18n.t(error));
    } finally {
      setLoading(false);
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
    if (tem && tem.fishType) {
      let value =
        tem.fishType.price * (parseFloat(tem.weight) - tem.basket.weight);
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
      title: i18n.t("basket"),
      dataIndex: "basket",
      key: "basket",
      render: (basket) => (
        <div>
          {basket && (
            <label>{basket.type + ": " + basket.weight + " (kg)"}</label>
          )}
        </div>
      ),
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
      title: i18n.t("truck"),
      dataIndex: "truck",
      key: "truck",
      render: (truck) => <div>{truck && <label>{truck.name}</label>}</div>,
    },
    {
      title: i18n.t("drum"),
      dataIndex: "listDrum",
      key: "listDrum",
      render: (listDrum) => renderDrum(listDrum),
    },
    {
      title: i18n.t("action"),
      key: "id",
      dataIndex: "id",
      render: (id) =>
        currentPurchase.status == "Pending" && (
          <Dropdown overlay={renderBtnAction(id)}>
            <Button>
              <i className="fa fa-cog mr-1" />
              <label className="tb-lb-action">{i18n.t("action")}</label>
            </Button>
          </Dropdown>
        ),
    },
  ];

  const handleAddPurchaseDetail = () => {
    setMode("create");
    setIsShowBuy(true);
  };

  const findPO = () => {
    if (currentPurchase.pondOwner && dataDf.pondOwner)
      return (
        dataDf.pondOwner.find(
          (el) => el.id === parseInt(currentPurchase.pondOwner)
        ) || {}
      );
    else return null;
  };

  // fetch data
  async function fetchData(query) {
    try {
      setLoading(true);
      let user = session.get("user");
      getPondOwnerByTraderId(user.userID);
      if (query && query.id) {
        getFTByPurchaseId(query.id);
      } else {
        getLastAllFTByTraderID();
      }
      getTruckByTraderID();
      //fetchDrumByTruck(dataDf.truck.id);
      getBasketByTraderId();
      if (query && query.id) getPurchasesById(query.id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getBasketByTraderId() {
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

  async function getLastAllFTByTraderID() {
    try {
      //get fish type trader id
      let rs = await apis.getLastAllFTByTraderID({}, "GET");
      if (rs && rs.statusCode === 200) {
        setData((pre) => ({
          ...pre,
          fishType: rs.data || [],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getFTByPurchaseId(purchaseId) {
    try {
      //get fish type by purchase id
      let rs = await apis.getAllFT({}, "GET", purchaseId);
      if (rs && rs.statusCode === 200) {
        let temListFish = [];
        rs.data.map((el) => temListFish.push(el.id + ""));
        let temObj = Object.assign(currentPurchase, {
          listFishId: temListFish,
          arrFish: rs.data,
        });
        setCurrentPurchase(temObj);
        local.set("currentPurchase", temObj);

        setData((pre) => ({
          ...pre,
          fishType: rs.data || [],
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getTruckByTraderID() {
    try {
      //get truck trader id
      let rs = await apis.getTruck({}, "GET");
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

  async function getPurchasesById(purchaseId) {
    try {
      let rs = await apis.getPurchasesById({}, "GET", purchaseId);
      if (rs && rs.statusCode === 200) {
        let tem = rs.data;
        tem = Object.assign(tem, currentPurchase);
        setCurrentPurchase(tem);
        local.set("currentPurchase", tem);
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
      let date = helper.getDateFormat();

      let rs = await apis.createPurchase({ traderId, pondOwnerID, date });
      if (rs && rs.statusCode === 200) {
        let tem = rs.data;
        tem = Object.assign(tem, currentPurchase);
        setCurrentPurchase(tem);
        local.set("currentPurchase", tem);
        return tem;
      } else {
        helper.toast("error", rs.message);
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
        setCurrentPurchase((pre) => ({ ...pre, weight: 0 }));
        // purchase goi y
        setSuggestionPurchase(detail);
        helper.toast("success", i18n.t(rs.message));
        setIsShowBuy(false);
      }
    } catch (error) {
      console.log(error);
    }
    //  finally {
    //   setIsShowBuy(false);
    // }
  }

  // updatePurchaseDetail
  async function updatePurchaseDetail(detail) {
    try {
      let { fishTypeId, basketId, weight, listDrumId = [] } = detail;
      let rs = await apis.updatePurchaseDetail({
        fishTypeId,
        basketId,
        weight,
        listDrumId,
        id: currentPurchase.purchaseDetailId,
        purchaseId: currentPurchase.id,
      });
      if (rs && rs.statusCode === 200) {
        getAllPurchaseDetail(currentPurchase);
        helper.toast("success", i18n.t(rs.message));
        setIsShowBuy(false);
      }
    } catch (error) {
      console.log(error);
    }
    // finally {
    //   setIsShowBuy(false);
    // }
  }

  // Get all purchase detail
  async function getAllPurchaseDetail(currentPurchase) {
    try {
      setLoading(true);
      let rs = await apis.getAllPurchaseDetail(
        {},
        "GET",
        currentPurchase.purchaseId || currentPurchase.id
      );
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        setPurchase(rs.data);
        if (currentPurchase.id) {
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const mergeByProperty = (target, source, prop) => {
    source.forEach((sourceElement) => {
      let targetElement = target.find((targetElement) => {
        return sourceElement[prop] === targetElement[prop];
      });
      targetElement
        ? Object.assign(targetElement, sourceElement)
        : target.push(sourceElement);
    });
  };

  // Update All fish type anhnbt
  async function updateAllFishType(body, purchase, onlyFe = false) {
    var success = false;
    try {
      setLoading(true);
      if (!onlyFe) {
        let rs = await apis.updateAllFishType(body, "POST");
        if (rs && rs.statusCode === 200) {
          let temObj = { ...purchase, ...currentPurchase, arrFish: rs.data };
          setCurrentPurchase(temObj);
          local.set("currentPurchase", temObj);
          let newArr = _.cloneDeep(dataDf.fishType);
          mergeByProperty(newArr, rs.data, "id");
          setData((pre) => ({
            ...pre,
            fishType: newArr || [],
          }));
          success = true;
          helper.toast("success", rs.message);
          await getAllPurchaseDetail(purchase);
        }
      } else {
        let temObj = {
          ...purchase,
          ...currentPurchase,
          arrFish: body.listFishType,
        };
        setCurrentPurchase(temObj);
        local.set("currentPurchase", temObj);
        let newArr = _.cloneDeep(dataDf.fishType);
        mergeByProperty(newArr, body.listFishType, "id");
        setData((pre) => ({
          ...pre,
          fishType: newArr || [],
        }));
        success = true;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      return success;
    }
  }

  function handleShowClosePurchase() {
    setShowClosePurchase(!isShowClosePurchase);
  }

  async function handleClosePurchase(data) {
    try {
      let { id, commissionPercent, isPaid } = data;

      let rs = await apis.closePurchase({
        id,
        isPaid,
        commissionPercent,
      });
      if (rs && rs.statusCode === 200) {
        helper.toast("success", i18n.t(rs.message));
        setCurrentPurchase((pre) => ({ ...pre, status: "Completed" }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleBack() {
    history.push("/buy");
  }

  const onChangePondOwner = async (value) => {
    var rs = await apis.updatePondOwnerInPurchase(
      {
        purchaseId: currentPurchase.id,
        pondOwnerId: value,
      },
      "POST"
    );
    if (rs && rs.statusCode === 200) {
      var newPur = { ...currentPurchase };
      newPur.pondOwnerId = value;
      var pO = dataDf.pondOwner.find((x) => x.id == value);
      newPur.pondOwnerName = pO ? pO.name : "";
      setCurrentPurchase(newPur);
    }
  };

  useEffect(() => {
    // lấy id trên address bar
    let query = queryString.parse(props.location.search, {
      ignoreQueryPrefix: true,
    });

    if (query && query.id) {
      query.id = parseInt(query.id);
      // setQuery(query);
    }

    let tem = local.get("currentPurchase") || query;
    if (tem.pondOwner) {
      tem.pondOwner = parseInt(tem.pondOwner);
    }
    // khi tao moi purchase
    if (tem.status === "Pending" && !query.id) {
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
    setData((pre) => ({ ...pre, arrFish: tem.arrFish }));
    if (tem.listFishId === undefined) {
      tem = { ...tem, listFishId: [] };
    }
    if (tem.status === undefined) {
      tem = { ...tem, status: "Pending" };
    }
    setCurrentPurchase(tem);

    fetchData(query);
    // eslint-disable-next-line
  }, [props, currentPurchasePROPS]);

  const renderTitle = () => {
    return (
      <Row>
        <Col md="6">
          {/* <h3 className="mr-5">{i18n.t("buyGood")}</h3> */}
          <h3 className="mr-5">Chi tiết đơn mua</h3>
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
  // if (isLoading) {
  //   return <div>loading...</div>;
  // } else
  return (
    <div>
      {isShowClosePurchase && (
        <ModalClosePurchase
          isShowClosePurchase={isShowClosePurchase}
          purchase={purchase}
          prCurrentPurchase={currentPurchase || {}}
          handleShowClosePurchase={handleShowClosePurchase}
          dataDf={dataDf}
          handleClosePurchase={handleClosePurchase}
        />
      )}
      {isShowBuy && (
        <ModalBuy
          isShowBuy={isShowBuy}
          setIsShowBuy={setIsShowBuy}
          currentPurchase={currentPurchase}
          purchase={purchase}
          dataDf={dataDf}
          createPurchaseDetail={createPurchaseDetail}
          fetchDrumByTruck={fetchDrumByTruck}
          mode={mode}
          updatePurchaseDetail={updatePurchaseDetail}
          suggestionPurchase={suggestionPurchase}
          setSuggestionPurchase={setSuggestionPurchase}
        />
      )}
      {isShowChoosePond && (
        <ChoosePond
          isShowChoosePond={isShowChoosePond}
          setShowChoosePond={setShowChoosePond}
          currentPurchase={currentPurchase}
          setCurrentPurchase={setCurrentPurchase}
          dataDf={dataDf}
          // setDataDf={(newDfFish) => {
          //   setData((pre) => ({
          //     ...pre,
          //     fishType: newDfFish || [],
          //   }));
          // }}
          createPurchase={createPurchase}
          updateAllFishType={updateAllFishType}
        />
      )}
      {!isShowChoosePond && (
        <Card title={renderTitle()}>
          <Row className="mb-2">
            <Col md="6">
              <Row>
                <Col md="4">
                  <label className="mt-1">
                    <b>{i18n.t("date")}:</b>&nbsp;
                    <Moment format="DD/MM/YYYY">{currentPurchase.date}</Moment>
                  </label>
                </Col>
                <Col md="8">
                  <Widgets.Select
                    label={i18n.t("pondOwner") + ": "}
                    value={parseInt(currentPurchase.pondOwnerId)}
                    items={dataDf.pondOwner}
                    displayField="name"
                    saveField="id"
                    isDisable={currentPurchase.status === "Completed"}
                    onChange={(value) => onChangePondOwner(value)}
                    needPleaseChose={false}
                    width={"75%"}
                  />
                </Col>
                {/* <label>
                  <b className="mr-2">{i18n.t("pondOwner")}:</b>
                  { //nếu ko có id thì dùng hàm findPO  }
                  {(findPO() && findPO().name) || currentPurchase.pondOwnerName}
                </label> */}
              </Row>
            </Col>
            <Col md="6">
              {/* nếu status khac Pending thì ko show btn thêm */}
              {currentPurchase.status === "Pending" && (
                <div className="float-right">
                  <Button
                    color="info"
                    onClick={() => handleShowClosePurchase()}
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
                  <Button
                    color="info"
                    onClick={handleAddPurchaseDetail}
                    className=" mr-2"
                  >
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
                scroll={{ y: 420 }}
                pagination={{ pageSize: 100 }}
                bordered
                rowKey="idx"
                summary={(pageData) => {
                  let totalWeight = 0;
                  let totalAmount = 0;
                  pageData.forEach(({ weight, price }) => {
                    totalWeight += weight;
                    totalAmount += price;
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
                        <Table.Summary.Cell key="2" colSpan="2">
                          <NumberFormat
                            value={totalWeight.toFixed(1)}
                            displayType={"text"}
                            thousandSeparator={true}
                            suffix=" Kg"
                            className="bold"
                          />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell key="3">
                          <NumberFormat
                            value={totalAmount}
                            displayType={"text"}
                            thousandSeparator={true}
                            suffix={i18n.t("suffix")}
                            className="bold"
                          />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell colSpan="3" key="4" />
                      </Table.Summary.Row>
                    </Table.Summary>
                  );
                }}
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default BuyFish;
