import React, { Component } from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import local from "../../services/local";
import i18n from "i18next";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "../../css/antd.css";
const { Header, Content, Sider } = Layout;
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
      <>
        {/* <Header
          className="site-layout-sub-header-background"
          style={{ padding: 0 }}
        /> */}
        <Sider
          style={{ paddingTop: 64 }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            // defaultSelectedKeys={["4"]}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
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
          className="site-layout-sub-header-background"
          // style={{ padding: 0 }}
        >
          <div className="logo">Logo</div>
        </Header>
      </>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => {
  return { userInfo: state.userInfo };
};
export default connect(mapStateToProps)(DefaultHeader);
