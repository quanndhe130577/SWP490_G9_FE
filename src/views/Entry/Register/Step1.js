import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
import { Form, Input, Select } from 'antd';

export default class Step1 extends Component {
  render() {
    let { value, onChange, phoneNumber } = this.props;
    console.log(value)
    return (
      <Row>
        <Col md="12">
          <label>
            Mã xác minh của bạn sẽ được gửi bằng tin nhắn đến {phoneNumber}
          </label>
        </Col>
        <Col md="12">
          {/* <Widgets.Text
            required={true}
            // label={i18n.t("OTP")}
            value={value || "123456"}
            onChange={onChange}
            // submitted={submitted}
          /> */}

          {/* <Form
            name="basic"
            initialValues={{ remember: true }}
            // onFinish={handleSubmit}
            layout="vertical"
          > */}

            <Form.Item
              label={i18n.t("OTP")}
              name="OTP"
              rules={[
                () => ({
                  validator(rule, value) {
                    if (!value || value.length <= 0) {
                      return Promise.reject(
                        new Error(
                          "Bat buoc nhap"
                        )
                      );
                    }
                    const checkPhone = /^[0-9\+]{6}$/.test(value);
                    if (checkPhone === false) {
                      return Promise.reject(
                        new Error(
                          "khong dung dinh dang"
                        )
                      );
                    }
                    return Promise.resolve();
                  }
                })
              ]}
            >
              <Input />
            </Form.Item>
          {/* </Form> */}
        </Col>
        <Col md="6">
          <label>
            {i18n.t("Bạn ko nhận được mã?")}
            <span> gửi lại</span>
          </label>
        </Col>
      </Row>
    );
  }
}
