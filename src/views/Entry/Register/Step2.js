import React, { Component } from "react";
// import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
import { Form, Input, Select } from 'antd';

const { Option } = Select;

export default function Step2(props) {
  const { items } = props;

  return (

    // <>
    //   <Widgets.Text
    //     label={i18n.t("firstName")}
    //     value={user.firstName}
    //     onChange={(e) => handleChange(e, "firstName")}
    //     submitted={submitted}
    //   />
    //   <Widgets.Text
    //     label={i18n.t("lastName")}
    //     value={user.lastName}
    //     onChange={(e) => handleChange(e, "lastName")}
    //     submitted={submitted}
    //   />
    //   <Widgets.Text
    //     label={i18n.t("identifyCode")}
    //     value={user.identifyCode}
    //     onChange={(e) => handleChange(e, "identifyCode")}
    //     submitted={submitted}
    //   />
    //   <Widgets.Select
    //     label={i18n.t("youAre")}
    //     value={user.roleNormalizedName}
    //     onChange={(e) => handleChange(e, "roleNormalizedName")}
    //     submitted={submitted}
    //     items={items}
    //   />

    //   <Widgets.Text
    //     type="password"
    //     required={true}
    //     label={i18n.t("Password")}
    //     value={user.password}
    //     onChange={(e) => handleChange(e, "password")}
    //     submitted={submitted}
    //   />
    // </>
    <>
      <Form.Item
        label={i18n.t("firstName")}
        name="firstname"
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
              const checkPhone = /^[a-z ,.'-]+$/.test(value);
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

      <Form.Item
        label={i18n.t("lastName")}
        name="lastname"
        rules={[{ required: true, message: 'Please input your password!' },
        () => ({
          validator(rule, value) {
            if (!value || value.length <= 0) {
              return Promise.reject(
                new Error(
                  "Bat buoc nhap"
                )
              );
            }
            const checkName = /^[a-z ,.'-]+$/.test(value);
            if (checkName === false) {
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

      <Form.Item
        label={i18n.t("identifyCode")}
        name="IdentifyCode"
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
              const checkPhone = /^[0-9\+]{10}$/.test(value);
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

      <Form.Item
        label={i18n.t("youAre")}
        name="RoleNormalizedName"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Select
          placeholder="Select a person"
          allowClear
        >
          {items.map((item, index) => {
            return (
              <Option key={index} value={item.value}>{item.label}</Option>
            )
          })}
          {/* <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="tom">Tom</Option> */}
        </Select>
      </Form.Item>

      <Form.Item
        label={i18n.t("Password")}
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
