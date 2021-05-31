import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'
import routes from '../../routes'
import _ from 'lodash'
import i18next from 'i18next'
import DefaultFooter from './DefaultFooter'
import DefaultHeader from './DefaultHeader'
// import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Layout, Breadcrumb } from 'antd'

const { Header, Content, Sider } = Layout

class DefaultLayout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            nav: [],
            skip: 0,
        }
    }

    render() {
        if (this.state.loading) return <p>{i18next.t('PROCESSING')}</p>
        return (
            <Layout>
                <DefaultHeader />
                <Content
                    className="site-layout"
                    style={{ padding: '0 50px', marginTop: 64 }}
                >
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item> */}
                        <Container>
                            <Switch>
                                {routes.map((route, idx) => {
                                    return route.component ? (
                                        <Route
                                            key={idx}
                                            path={route.path}
                                            exact={route.exact}
                                            name={route.name}
                                            render={(props) => (
                                                <route.component {...props} />
                                            )}
                                        />
                                    ) : null
                                })}
                                {/* <Redirect from="/" to="/login" /> */}
                            </Switch>
                        </Container>
                    </Breadcrumb>
                    <div
                        className="site-layout-background"
                        style={{ padding: 24, minHeight: 380 }}
                    >
                        Content
                    </div>
                </Content>
                <DefaultFooter />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => {
    return { userInfo: state.userInfo }
}
export default connect(mapStateToProps)(DefaultLayout)
