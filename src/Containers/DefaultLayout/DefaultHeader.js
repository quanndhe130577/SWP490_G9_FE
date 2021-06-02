import React, { Component } from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import local from "../../services/local";
import i18n from "i18next";
import { Layout, Menu } from "antd";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import "../../css/antd.css";
const { Header, Content } = Layout;
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

  onLogoutClick() {
    window.location.href = "";
    api.logout();
    local.clear();
  }

  render() {
    let { isShowModalLogout } = this.state;

    // const { children, ...attributes } = this.props;
    // console.log(isShowModalLogout);

    return (
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <Menu
          theme="dark"
          mode="horizontal"
          // defaultSelectedKeys={["2"]}
        >
          <Menu.Item key="1">
            <Link to="dashboard">{i18n.t("home")}</Link>
          </Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
          <SubMenu
            key="SubMenu"
            icon={<SettingOutlined />}
            title="Navigation Three - Submenu"
          >
            <Menu.ItemGroup title="Item 1">
              <Menu.Item key="setting:1">Option 1</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Item 2">
              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          <Menu.Item key="5">nav 2</Menu.Item>
          <Menu.Item key="as" className="pull-right">
            <UserOutlined />
          </Menu.Item>
        </Menu>
      </Header>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => {
  return { userInfo: state.userInfo };
};
export default connect(mapStateToProps)(DefaultHeader);
