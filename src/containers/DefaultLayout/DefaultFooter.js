import React, { Component } from "react";

import { Layout } from "antd";

const { Footer } = Layout;

class DefaultFooter extends Component {
  render() {
    return <Footer style={{ textAlign: "center" }}>TnR - 0987654321</Footer>;
  }
}

export default DefaultFooter;
