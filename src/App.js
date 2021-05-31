import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import './css/custom.css'
import 'antd/dist/antd.css'
// Containers
import { DefaultLayout } from './Containers'
// Pages
import Login from './Views/Login/Login'

class App extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route
                        exact
                        path="/login"
                        name="Login Page"
                        component={Login}
                    />
                    <Route path="/" name="Home" component={DefaultLayout} />
                </Switch>
            </HashRouter>
        )
    }
}

export default App
