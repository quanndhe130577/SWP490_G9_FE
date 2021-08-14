import React, { Component } from "react";
// import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";
import i18n from "i18next";
export default class Step1 extends Component {
  render() {
    const { handleChange, user, items, submitted } = this.props;
    return (
      <>
        <Widgets.Text
          label={i18n.t("firstName")}
          value={user.firstName}
          onChange={(e) => handleChange(e, "firstName")}
          submitted={submitted}
        />
        <Widgets.Text
          label={i18n.t("lastName")}
          value={user.lastName}
          onChange={(e) => handleChange(e, "lastName")}
          submitted={submitted}
        />
        <Widgets.Text
          label={i18n.t("identifyCode")}
          value={user.identifyCode}
          onChange={(e) => handleChange(e, "identifyCode")}
          submitted={submitted}
        />
        <Widgets.Text
          label={i18n.t("address")}
          value={user.address}
          onChange={(e) => handleChange(e, "address")}
          submitted={submitted}
        />
        <Widgets.Select
          label={i18n.t("youAre")}
          value={user.roleNormalizedName}
          onChange={(e) => handleChange(e, "roleNormalizedName")}
          submitted={submitted}
          items={items}
        />

        <Widgets.Text
          type="password"
          required={true}
          label={i18n.t("Password")}
          value={user.password}
          onChange={(e) => handleChange(e, "password")}
          submitted={submitted}
        />
      </>
    );
  }
}
