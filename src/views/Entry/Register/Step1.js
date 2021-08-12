import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
export default class Step1 extends Component {
  render() {
    let { value, onChange, phoneNumber } = this.props;
    return (
      <Row>
        <Col md="12">
          <label>
            Mã xác minh của bạn sẽ được gửi bằng tin nhắn đến {phoneNumber}
          </label>
        </Col>
        <Col md="12">
          <Widgets.Text
            required={true}
            // label={i18n.t("OTP")}
            value={value}
            onChange={onChange}
            // submitted={submitted}
          />
        </Col>
        <Col md="6">
          <label>
            {i18n.t("Bạn không nhận được mã?")}
            <span> Gửi lại OPT</span>
          </label>
        </Col>
      </Row>
    );
  }
}
