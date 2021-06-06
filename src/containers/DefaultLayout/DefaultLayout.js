import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import { connect } from "react-redux";
import routes from "../../routes";
import _ from "lodash";
import i18next from "i18next";
import DefaultFooter from "./DefaultFooter";
import DefaultHeader from "./DefaultHeader";
// import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Layout, Breadcrumb } from "antd";
import local from "../../services/local"

const { Header, Content, Sider } = Layout;

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,

    };
  }
  async componentDidMount() {
    try {
      var session = await local.get('session');
      if (!session) {
        this.props.history.replace('/login');
      }
    } catch (err) {
      console.log('loi roi , err here', err)
      this.props.history.replace('/login');
    }
  }

  render() {
    if (this.state.loading)
      return <p>{i18next.t("PROCESSING")}</p>;
    return (
      <Layout>
        <DefaultHeader />
        <Content className="site-layout" style={{ marginTop: 64 }}>


          <div className="default-layout">
            <Switch>
              {routes.map((route, idx) => {
                return route.component ? (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}
              <Redirect from="/" to="/login" />
            </Switch>
          </div>


        </Content>
        <DefaultFooter />
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user.user, token: state.user.token };
};
export default connect(mapStateToProps)(DefaultLayout);
