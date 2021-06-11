import React, { useState } from "react";
import { Row, Col, Card, Table, Tag, Space } from "antd";
import { Button } from "reactstrap";
import i18n from "i18next";
import ModalBuy from "./ModalBuy";
import Moment from "react-moment";
import Widgets from "../../../../schema/Widgets";

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
  const [totalBuy, setTotalBuy] = useState({});

  const showModal = () => {
    setIsShowBuy(true);
  };
  const handleChange = () => {
    setIsShowBuy(true);
    setTotalBuy({});
  };
  const renderTitle = () => {
    return (
      <div className="d-flex">
        <h3 className="mr-5">{i18n.t("Mua hàng")}</h3>
        <Moment format="DD/MM/YYYY" className="mt-2">
          {new Date()}
        </Moment>
      </div>
    );
  };

  return (
    <Card title={renderTitle()}>
      {isShowBuy && (
        <ModalBuy isShowBuy={isShowBuy} setIsShowBuy={setIsShowBuy} />
      )}

      <Row className="mb-2">
        <Col span="24" className="">
          <div className="float-left">
            <Widgets.Select
              required={true}
              label={i18n.t("pondOwner")}
              value={totalBuy.pondOwner}
              onChange={(e) => handleChange(e, "roleNormalizedName")}
              items={pondOwners}
            />
          </div>
          <div className="float-right">
            <Button color="info" onClick={showModal} className="mr-2">
              {i18n.t("Giá cá hôm nay2")}
            </Button>
            <Button color="info" onClick={showModal} className=" mr-2">
              {i18n.t("Thêm Mã")}
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        <Col span="24" style={{ overflowX: "auto" }}>
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
const pondOwners = [{ value: 1, label: "Chủ Ao 1" }];
