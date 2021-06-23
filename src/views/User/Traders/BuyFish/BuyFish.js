import React, { useState, useEffect } from "react";
import { Card, Table } from "antd";
import { Button, Row, Col } from "reactstrap";
import i18n from "i18next";
import ModalBuy from "./ModalBuy";
import ChoosePond from "./ChoosePond";
import Moment from "react-moment";
import local from "../../../../services/local";
import session from "../../../../services/session";
import apis from "../../../../services/apis";
// import dataDf from "../../../../data";
const BuyFish = () => {
  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isShowChoosePond, setShowChoosePond] = useState(true);
  const [totalBuy, setTotalBuy] = useState({});
  const [currentTotal, setCurrentTotal] = useState({});
  const [transactions, setTrans] = useState([]);
  const [currentTran, setCurrentTran] = useState({});
  const [dataDf, setData] = useState({ basket: [], drum: [], truck: [] });

  const handelAction = (action, sid) => {
    if (action === "delete") {
      let tem = transactions.filter((el) => el.sid !== sid);
      setTrans(tem);
    } else {
      let tem = transactions.find((e) => e.sid === sid);
      if (tem) {
        setCurrentTran(tem);
        setIsShowBuy(true);
      }
    }
  };
  const findLabel = (obj, key) => {
    // debugger;
    return dataDf[obj].find((el) => el.id === parseInt(key)) || {};
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "sid",
      key: "sid",
      render: (text) => <label>{text}</label>,
    },
    {
      title: i18n.t("typeOfFish"),
      dataIndex: "typeOfFish",
      key: "typeOfFish",
      render: (drum) => (
        <div>{drum && <label>{findLabel("fishType", drum).label}</label>}</div>
      ),
    },
    {
      title: i18n.t("qtyOfFish(Kg)"),
      dataIndex: "qtyOfFish",
      key: "qtyOfFish",
      // responsive: ["lg"],
    },
    {
      title: i18n.t("basket"),
      dataIndex: "basket",
      render: (basket) => (
        <div>
          {basket && <label>{findLabel("basket", basket).label}</label>}
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
        <div>{truck && <label>{findLabel("truck", truck).label}</label>}</div>
      ),
    },

    {
      title: "Action",
      key: "sid",
      dataIndex: "sid",
      render: (sid) => (
        <div>
          {sid && (
            <div>
              <label onClick={() => handelAction("edit", sid)}>
                {i18n.t("edit")} {sid}
              </label>
              <label onClick={() => handelAction("delete", sid)}>
                {i18n.t("delete")} {sid}
              </label>
            </div>
          )}
        </div>
      ),
    },
  ];

  const showModal = () => {
    setIsShowBuy(true);
  };
  const handleTotalBuy = (value, prop) => {
    // debugger;
    setTotalBuy((pre) => ({
      ...pre,
      [prop]: value,
    }));
  };
  const handleTrans = (value) => {
    setCurrentTran({});
    setTrans((pre) => [...pre, value]);
  };

  const findPO = () => {
    if (currentTotal.pondOwner && dataDf.pondOwner)
      return (
        dataDf.pondOwner.find((el) => el.id === parseInt(currentTotal.pondOwner)) || {}
      );
    else return {};
  };
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
      setLoading(false);

    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    let tem = local.get("currentTotal") || {};
    if (tem.pondOwner) {
      tem.pondOwner = parseInt(tem.pondOwner)
    }
    setCurrentTotal(tem);
    fetchData();
  }, []);
  const renderTitle = () => {
    return (
      <Row>
        <Col md="3">
          <h3 className="mr-5">{i18n.t("Mua hàng")}</h3>
        </Col>
        <Col md="2">
          <Moment format="DD/MM/YYYY" className="mt-2">
            {new Date()}
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
            currentTotal={currentTotal}
            transactions={transactions}
            handleTrans={handleTrans}
            currentTran={currentTran}
            dataDf={dataDf}
          />
        )}
        {isShowChoosePond && (
          <ChoosePond
            isShowChoosePond={isShowChoosePond}
            setShowChoosePond={setShowChoosePond}
            handleTotalBuy={handleTotalBuy}
            pondOwner={totalBuy.pondOwner || ""}
            currentTotal={currentTotal}
            setCurrentTotal={setCurrentTotal}
            dataDf={dataDf}
          />
        )}
        {!isShowChoosePond &&
          <Card title={renderTitle()}>


            <Row className="mb-2">
              <Col span="24" className="">
                {/* <div className="float-left">
<Widgets.Select
required={true}
label={i18n.t("pondOwner")}
value={totalBuy.pondOwner}
onChange={(e) => handleChange(e, "roleNormalizedName")}
items={dataDf.pondOwner}
/>
</div> */}
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
                <Table columns={columns} dataSource={transactions}
                  loading={isLoading} />
              </Col>
            </Row>
          </Card>
        }
      </div>
    );
};

export default BuyFish;
