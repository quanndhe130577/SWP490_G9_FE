import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
export default class Step1 extends Component {
  render() {
    let { value, onChange, onKeyDown } = this.props;
    return (
      <Row>
        <Col md="12">
          <Widgets.Text
            required={true}
            label={i18n.t("phoneNumber")}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
        </Col>
      </Row>
    );
  }
}
