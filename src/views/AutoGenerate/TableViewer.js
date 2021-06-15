// import React, { Component } from "react";
// import { Button, Col, Row } from "reactstrap";
// import helper from "../../services/helper";
// import queryString from "qs";
// import Moment from "react-moment";
// import _ from "lodash";
// import moment from "moment";
// import Widgets from "../../schema/Widgets";
// import config from "../../services/config";
// // import { Prompt } from "react-router";

// import i18n from "i18next";

// import local from "../../services/local";
// import Swal from "sweetalert2";

// import { Table, Switch, Radio, Form, Space, Card } from "antd";
// import { DownOutlined } from "@ant-design/icons";

// const columns = [
//   {
//     title: "Name",
//     dataIndex: "name",
//   },
//   {
//     title: "Age",
//     dataIndex: "age",
//     sorter: (a, b) => a.age - b.age,
//   },
//   {
//     title: "Address",
//     dataIndex: "address",
//     filters: [
//       {
//         text: "London",
//         value: "London",
//       },
//       {
//         text: "New York",
//         value: "New York",
//       },
//     ],
//     onFilter: (value, record) => record.address.indexOf(value) === 0,
//   },
//   {
//     title: "Action",
//     key: "action",
//     sorter: true,
//     render: () => (
//       <Space size="middle">
//         <a>Delete</a>
//         <a className="ant-dropdown-link">
//           More actions <DownOutlined />
//         </a>
//       </Space>
//     ),
//   },
// ];

// const data = [];
// for (let i = 1; i <= 10; i++) {
//   data.push({
//     key: i,
//     name: "John Brown",
//     age: `${i}2`,
//     address: `New York No. ${i} Lake Park`,
//     description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
//   });
// }

// class ListViewer extends Component {
//   constructor(props) {
//     super(props);
//     this.query = queryString.parse(props.location.search, {
//       ignoreQueryPrefix: true,
//     });
//     this.state = {
//       hasData: true,
//     };
//   }

//   componentDidMount() {}
//   componentWillReceiveProps(next) {
//     this.query = queryString.parse(next.location.search, {
//       ignoreQueryPrefix: true,
//     });
//   }

//   renderTitle = () => {
//     return (
//       <Row>
//         <Col md="3">
//           <h3 className="mr-5">{i18n.t(this.state.title)}</h3>
//         </Col>
//       </Row>
//     );
//   };

//   render() {
//     const { xScroll, yScroll, ...state } = this.state;

//     const scroll = {};
//     if (yScroll) {
//       scroll.y = 240;
//     }
//     if (xScroll) {
//       scroll.x = "100vw";
//     }

//     const tableColumns = columns.map((item) => ({
//       ...item,
//       ellipsis: state.ellipsis,
//     }));
//     if (xScroll === "fixed") {
//       tableColumns[0].fixed = true;
//       tableColumns[tableColumns.length - 1].fixed = "right";
//     }
//     if (this.state.error)
//       return <p className="text-danger">{this.state.error}</p>;

//     return (
//       <Card title={this.renderTitle()}>
//         {/* <Modal
//           title={i18n.t("choosePond")}
//           centered
//           visible={isShowChoosePond}
//           onOk={this.handleOk}
//           onCancel={this.handleCancel}
//           width={1000}
//         >

//         </Modal> */}
//         <div>
//           <Row>BUTTON</Row>
//           <Row>
//             <Col md="12" style={{ overflowX: "auto" }}>
//               <Table
//                 // {...this.state}
//                 // pagination={{ position: [this.state.top, this.state.bottom] }}
//                 columns={tableColumns}
//                 dataSource={state.hasData ? data : null}
//                 scroll={scroll}
//               />
//             </Col>
//           </Row>
//         </div>
//       </Card>
//     );
//   }
// }

// export default ListViewer;
