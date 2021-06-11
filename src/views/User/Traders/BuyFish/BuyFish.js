import React, { useState, useEffect } from "react";
import { Card, Table, Tag, Space } from "antd";
import { Button, Row, Col } from "reactstrap";
import i18n from "i18next";
import ModalBuy from "./ModalBuy";
import ChoosePond from "./ChoosePond";
import Moment from "react-moment";
// import Widgets from "../../../../schema/Widgets";
import local from "../../../../services/local";
import dataDf from "../../../../data";
const BuyFish = () => {
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (text) => <label>{text}</label>,
    },
    {
      title: "Age (medium screen or bigger)",
      dataIndex: "age",
      key: "age",
      // responsive: ["md"],
    },
    {
      title: "Address (large screen or bigger)",
      dataIndex: "address",
      key: "address",
      // responsive: ["lg"],
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <label>Invite {record.name}</label>
          <label>Delete</label>
        </Space>
      ),
    },
  ];

  const [isShowBuy, setIsShowBuy] = useState(false);
  const [isShowChoosePond, setShowChoosePond] = useState(true);
  const [totalBuy, setTotalBuy] = useState({});

  const showModal = () => {
    setIsShowBuy(true);
  };
  // const handleChange = () => {
  //   setIsShowBuy(true);
  //   setTotalBuy({});
  // };
  const handleTotalBuy = (value, prop) => {
    setTotalBuy((pre) => ({
      ...pre,
      [prop]: value,
    }));
  };
  const findPO = () => {
    return (
      dataDf.pondOwner.find((word) => word.value === totalBuy.currentPO) || {}
    );
  };
  useEffect(() => {
    let currentPO = local.get("currentPO");
    handleTotalBuy(currentPO, "currentPO");
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
            {findPO().label || ""}
          </label>
        </Col>
      </Row>
    );
  };

  return (
    <Card title={renderTitle()}>
      {isShowBuy && (
        <ModalBuy isShowBuy={isShowBuy} setIsShowBuy={setIsShowBuy} />
      )}
      {isShowChoosePond && (
        <ChoosePond
          isShowChoosePond={isShowChoosePond}
          setShowChoosePond={setShowChoosePond}
          handleTotalBuy={handleTotalBuy}
          pondOwner={totalBuy.pondOwner || ""}
          currentPO={totalBuy.currentPO}
        />
      )}

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
              {i18n.t("Giá cá hôm nay2")}
            </Button>
            <Button color="info" onClick={showModal} className=" mr-2">
              {i18n.t("Thêm Mã")}
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col style={{ overflowX: "auto" }}>
          <Table columns={columns} dataSource={data} />
        </Col>
      </Row>
    </Card>
  );
};

export default BuyFish;

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];
