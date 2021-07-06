import i18n from "i18next";
import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import TruckComponent from './components/TruckComponent';
import OtoComponent from "./components/otoComponent";
export default function Truck1() {
  const [isCreate, setIsCreate] = useState(false);


  const renderTitle = () => {
    let total = 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("truckManagement")}</h3>
          <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
        </Col>

        <Col md="6">
          <Button
            color="info"
            className="pull-right"
          // onClick={() => {
          //   this.setState({ isShowModal: true, mode: "create" });
          // }}
          >
            <i className="fa fa-plus mr-1" />
            {i18n.t("create")}
          </Button>
        </Col>
      </Row>
    );
  };


  return (
    <div>
      {renderTitle()}
      <TruckComponent isModal={false} />
      {isCreate && <OtoComponent />}
    </div>
  )
}