import React, { Component } from "react";
import NormalInfo from "./Components/NormalInfo";
// import ChangePhoneNumber from "./Components/ChangePhoneNumber";
import ChangePassword from "./Components/ChangePassword";
import { Tabs, Card } from "antd";
import i18n from "i18next";

import "./ChangeUserInfo.css";

class ChangeUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "demo",
      lastName: "demo",
      dob: new Date("01/01/1999"),
      identifyCode: "030099005068",
      avatar: "https://via.placeholder.com/150",
      preview: "https://via.placeholder.com/150",
    };
  }
  handleChange = (event) => {
    const target = event.target;
    const { name, value } = target;
    this.setState({
      [name]: value,
    });
  };

  renderTitle = () => {
    return (
      <div className="d-flex">
        <h3 className="mr-5">{i18n.t("change-user-infor")}</h3>
      </div>
    );
  };
  render() {
    return (
      <Card title={this.renderTitle()} className="body-minH">
        <div style={{ minHeight: "50em" }}>
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab="Đổi thông tin cơ bản" key="1">
              <NormalInfo />
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="Đổi số điện thoại" key="2">
              <ChangePhoneNumber />
            </Tabs.TabPane> */}
            <Tabs.TabPane tab="Đổi mật khẩu" key="3">
              <ChangePassword />
            </Tabs.TabPane>
          </Tabs>
          {/* <div className="row">
          <div className="col-md-2 mb-3">
            <div className="list-group">
              <NavLink
                exact
                to="/changeUserInfo/normalInfo"
                className="list-group-item"
              >
                Đổi thông tin cơ bản
              </NavLink>
              <NavLink
                exact
                to="/changeUserInfo/changePassword"
                className="list-group-item"
              >
                Đổi mật khẩu
              </NavLink>
              <NavLink
                exact
                to="/changeUserInfo/changePhonenumber"
                className="list-group-item"
              >
                Đổi số điện thoại
              </NavLink>
            </div>
          </div>
          <div className="col-md-10">
            <HashRouter>
              <Switch>
                <Route
                  path="/changeUserInfo/normalInfo"
                  component={NormalInfo}
                />
                <Route
                  path="/changeUserInfo/changePhonenumber"
                  component={ChangePhoneNumber}
                />
                <Route
                  path="/changeUserInfo/changePassword"
                  component={ChangePassword}
                />
              </Switch>
            </HashRouter>
          </div>
        </div> */}
        </div>
      </Card>
    );
  }
}

export default ChangeUserInfo;
