import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import session from "../../services/session";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../../css/antd.css";
import i18n from "i18next";
import { MENU } from "../../constant";
const { Header, Sider } = Layout;
const { SubMenu } = Menu;

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { user: {} };
  }

  componentDidMount() {
    let user = session.get("user") || {};
    this.setState({ user });
  }
  render() {
    let { user } = this.state;

    const menuOverlay = (
      <Menu>
        <Menu.Item icon={<SettingOutlined />} key="1">
          <Link to="/changeUserInfo">{i18n.t("changeInfo")}</Link>
        </Menu.Item>
        <Menu.Item icon={<LogoutOutlined />} key="2">
          <Link to="/logout">{i18n.t("logout")}</Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <Sider
          className="site-layout-background"
          style={{ paddingTop: 64 }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => { }}
          onCollapse={(collapsed, type) => { }}
        >
          <Menu mode="inline">
            {/* auto generate menu, define menu in MENU */}
            {/* eslint-disable-next-line array-callback-return */}
            {MENU.map((mn, idx) => {
              if (mn.type === "subMenu") {
                const { title, menu, icon } = mn;
                if (!mn.role || mn.role === user.roleDisplayName)
                  return (
                    <SubMenu
                      key={title + idx}
                      icon={icon}
                      title={i18n.t(title)}
                    >
                      {/* eslint-disable-next-line array-callback-return */}
                      {menu.map((me, i) => {
                        if (!me.role || me.role === user.roleDisplayName)
                          // console.log()
                          return (
                            <Menu.Item key={me.title + idx}>
                              <Link to={me.link}>{i18n.t(me.title)}</Link>
                            </Menu.Item>
                          );
                      })}
                    </SubMenu>
                  );
              } else {
                if (!mn.role || mn.role === user.roleDisplayName)
                  return (
                    <Menu.Item key={mn.title + idx} icon={mn.icon}>
                      <Link to={mn.link}>{i18n.t(mn.title)}</Link>
                    </Menu.Item>
                  );
              }
            })}
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

          <Dropdown overlay={menuOverlay} placement="topRight">
            <Avatar
              className="dropdown-toggle mt-2"
              size={45}
              icon={
                session.get("user") === null ? (
                  <UserOutlined />
                ) : (
                  <img
                    src={session.get("user").avatar || "assets/logo.png"}
                    alt="Preview"
                  />
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

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(DefaultHeader);
