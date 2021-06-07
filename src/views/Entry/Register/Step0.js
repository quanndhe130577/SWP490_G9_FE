import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
export default class Step1 extends Component {
  render() {
    let { value, onChange } = this.props;
    return (
      <Row>
        <Col md="12" style={{ textAlign: "center" }}>
          <img src="assets/image/bannerVn.png" className="image" />
        </Col>
        <Col md="12">
          <Widgets.Text
            required={true}
            label={i18n.t("phoneNumber")}
            value={value}
            onChange={onChange}
            // submitted={submitted}
          />
        </Col>
      </Row>
    );
  }
}
