import React, { Component } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import session from "../../services/session";
import { Layout, Menu, Dropdown, Avatar } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  TableOutlined,
  SettingOutlined,
  CarOutlined,
  CalendarOutlined,
  OrderedListOutlined,
  UsergroupAddOutlined,
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
          onBreakpoint={(broken) => {}}
          onCollapse={(collapsed, type) => {}}
        >
          <Menu mode="inline">
            {/* auto generate menu, define menu in MENU */}
            {MENU.map((mn, idx) => {
              if (mn.type === "subMenu") {
                const { title, menu, icon } = mn;
                return (
                  <SubMenu key={idx + title} icon={icon} title={i18n.t(title)}>
                    {menu.map((me, i) => (
                      <Menu.Item key={me + i + idx}>
                        <Link to={me.link}>{i18n.t(me.title)}</Link>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                );
              } else {
                return (
                  <Menu.Item key={mn + idx} icon={mn.icon}>
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
const MENU = [
  {
    type: "subMenu",
    title: "goodManagement",
    icon: <SettingOutlined />,
    menu: [
      {
        link: "/buyF",
        title: "buyGood",
      },
    ],
  },
  {
    title: "pondOwnerManagement",
    icon: <UserOutlined />,
    link: "/pondOwner",
  },
  {
    title: "fishType",
    icon: <OrderedListOutlined />,
    link: "/fishType",
  },

  {
    title: "basket",
    icon: <TableOutlined />,
    link: "/basket",
  },
  {
    type: "subMenu",
    title: "truck",
    icon: <CarOutlined />,
    menu: [
      {
        link: "/truck",
        title: "truck",
      },
      {
        link: "/drum",
        title: "drum",
      },
    ],
  },
  {
    title: "EmployeeManagement",
    icon: <UsergroupAddOutlined />,
    link: "/employee",
  },
  {
    title: "Time keeping",
    icon: <CalendarOutlined />,
    link: "/timeKeeping",
  },
];

export default connect(mapStateToProps)(DefaultHeader);
