import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import session from "../../services/session";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  SettingOutlined,
  CarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import "../../css/antd.css";
import i18n from "i18next";
const { Header, Sider } = Layout;
const propTypes = {
  children: PropTypes.node,
};
const { SubMenu } = Menu;
const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item icon={<SettingOutlined />}>
          <Link to="/changeUserInfo">{i18n.t("changeInfo")}</Link>
        </Menu.Item>
        <Menu.Item icon={<LogoutOutlined />}>
          <Link to="/logout">{i18n.t("logout")}</Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <Sider
          style={{ paddingTop: 64 }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {}}
          onCollapse={(collapsed, type) => {}}
        >
          <Menu theme="dark" mode="inline">
            <SubMenu
              key="SubMenu"
              icon={<SettingOutlined />}
              title={i18n.t("goodManagement")}
            >
              <Menu.Item key="setting:1">
                <Link to="/buyF">{i18n.t("buyGood")}</Link>
              </Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              <Link to="/pondOwner">{i18n.t("pondOwnerManagement")}</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              <Link to="/fishType">{i18n.t("fishType")}</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              <Link to="/basket">{i18n.t("basket")}</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<CarOutlined />}>
              <Link to="/truck">{i18n.t("truck")}</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<CalendarOutlined />}>
              <Link to="/timeKeeping">{i18n.t("timeKeeping")}</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Header
          style={{ position: "fixed", zIndex: 1, width: "100%" }}
          className="site-layout-sub-header-background d-flex justify-content-between"
        >
          <div className="logo">
            <Link to="/home">
              <img
                src="assets/image/favicon.png"
                alt="logo"
                style={{ width: 50 }}
              />
            </Link>
          </div>

          <Dropdown overlay={menu} placement="topRight">
            <Avatar
              className="dropdown-toggle mt-2"
              size={45}
              icon={
                session.get("user") == null ? (
                  <UserOutlined />
                ) : (
                  <img src={session.get("user").avatar} alt="Preview" />
                )
              }
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            />
          </Dropdown>
        </Header>
      </>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => {
  return { user: state.user };
};
export default connect(mapStateToProps)(DefaultHeader);
