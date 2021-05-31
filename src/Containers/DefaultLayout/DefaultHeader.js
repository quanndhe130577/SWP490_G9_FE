import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import local from '../../services/local'

import { Layout, Menu } from 'antd'

const { Header, Content } = Layout
const propTypes = {
    children: PropTypes.node,
}

const defaultProps = {}

class DefaultHeader extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    onLogoutClick() {
        window.location.href = ''
        api.logout()
        local.clear()
    }

    render() {
        let { isShowMore, isShowModalLogout } = this.state

        const { children, ...attributes } = this.props
        console.log(isShowModalLogout)

        return (
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                >
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                    <Menu.Item key="4">nav 1</Menu.Item>
                    <Menu.Item key="5">nav 2</Menu.Item>
                    <Menu.Item key="as">nav 3</Menu.Item>
                </Menu>
            </Header>
        )
    }
}

DefaultHeader.propTypes = propTypes
DefaultHeader.defaultProps = defaultProps

const mapStateToProps = (state) => {
    return { userInfo: state.userInfo }
}
export default connect(mapStateToProps)(DefaultHeader)
