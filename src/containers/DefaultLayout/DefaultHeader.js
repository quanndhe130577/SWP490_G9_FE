import React, { Component } from "react";
import { Avatar } from "antd";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import local from "../../services/local";
import apis from "../../services/apis";
import { Layout, Menu, Dropdown, Button, Space } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../../css/antd.css";
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

  onLogoutClick() {
    window.location.href = "";
    apis.logout();
    local.clear();
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item icon={<SettingOutlined />}>
          <Link to="/changeUserInfo">Đổi thông tin</Link>
        </Menu.Item>
        <Menu.Item icon={<LogoutOutlined />}>
          <Link to="/logout">Đăng xuất</Link>
        </Menu.Item>
      </Menu>
    );
    let { isShowModalLogout } = this.state;
    // const { children, ...attributes } = this.props;
    // console.log(isShowModalLogout);

    return (
      <>
        <Sider
          style={{ paddingTop: 64 }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {}}
          onCollapse={(collapsed, type) => {
            // console.log(collapsed, type);
          }}
        >
          <Menu theme="dark" mode="inline">
            <SubMenu
              key="SubMenu"
              icon={<SettingOutlined />}
              title="quản lí nhân viên"
            >
              <Menu.Item key="setting:1">thêm nhân viên</Menu.Item>
              <Menu.Item key="setting:2">Option 2</Menu.Item>

              <Menu.Item key="setting:3">Option 3</Menu.Item>
              <Menu.Item key="setting:4">Option 4</Menu.Item>
            </SubMenu>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              nav 4
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
                local.get("user") == null ? (
                  <UserOutlined />
                ) : (
                  <img src={local.get("user").avatar} alt="Preview" />
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
