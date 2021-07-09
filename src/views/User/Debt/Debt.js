import { SearchOutlined } from "@ant-design/icons";
import { Card, Dropdown, Input, Menu, Space, Table } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import NumberFormat from "react-number-format";
import { Button, Col, Row } from "reactstrap";
import apis from "../../../services/apis";
import helper from "../../../services/helper";
import session from "../../../services/session";
import ModalForm from "./ModalForm";
import Moment from "react-moment";
export default class Debt extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        searchText: "",
        searchedColumn: "",
        isShowModal: false,
        mode: "",
        data: [],
        loading: true,
      };
    }

    componentDidMount() {
      this.fetchDebt();
    }
  
    async fetchDebt() {
      try {
        this.setState({ loading: true });
        let user = await session.get("user");
        let rs = await apis.getAllDebt({}, "GET");
        if (rs && rs.statusCode === 200) {
          rs.data.map((el, idx) => (el.idx = idx + 1));
          this.setState({ data: rs.data, user, total: rs.data.length });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ loading: false });
      }
    }

    getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                this.setState({
                  searchText: selectedKeys[0],
                  searchedColumn: dataIndex,
                });
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex]
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select(), 100);
        }
      },
      render: (text) =>
        this.state.searchedColumn === dataIndex ? <div>{text}</div> : text,
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      this.setState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };
  
    handleReset = (clearFilters) => {
      clearFilters();
      this.setState({ searchText: "" });
    };
    
    closeModal = (refresh) => {
      if (refresh === true) {
        this.fetchDebt();
      }
      this.setState({ isShowModal: false, mode: "", currentDebt: {} });
    };
    onClick(modeBtn, DebtID) {
      let { currentDebt, data } = this.state;
  
      if (modeBtn === "edit") {
        currentDebt = data.find((el) => el.id === DebtID);
        currentDebt.createdDate = new Date(currentDebt.createdDate);
        currentDebt.deadline = new Date(currentDebt.deadline);
        this.setState({ currentDebt, mode: "edit", isShowModal: true });
      } else if (modeBtn === "delete") {
        helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
          if (rs) {
            try {
              let rs = await apis.deleteDebt({}, "POST", DebtID);
              if (rs && rs.statusCode === 200) {
                helper.toast("success", rs.message || i18n.t("success"));
                this.fetchDebt();
              }
            } catch (error) {
              console.log(error);
              helper.toast("error", i18n.t("systemError"));
            }
          }
        });
      }
    }
    renderBtnAction(id) {
      return (
        <Menu>
          <Menu.Item key="1">
            <Button
              color="info"
              className="mr-2"
              onClick={() => this.onClick("edit", id)}
            >
              <i className="fa fa-pencil-square-o mr-1" />
              {i18n.t("edit")}
            </Button>
          </Menu.Item>
          <Menu.Item key="2">
            <Button color="danger" onClick={() => this.onClick("delete", id)}>
              <i className="fa fa-trash-o mr-1" />
              {i18n.t("delete")}
            </Button>
          </Menu.Item>
        </Menu>
      );
    }

    renderTitle = () => {
      let { total } = this.state || 0;
      return (
        <Row>
          <Col md="6" className="d-flex">
            <h3 className="">{i18n.t("Debt Management")}</h3>
            <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
          </Col>
  
          <Col md="6">
            <Button
              color="info"
              className="pull-right"
              onClick={() => {
                this.setState({ isShowModal: true, mode: "create" });
              }}
            >
              <i className="fa fa-plus mr-1" />
              {i18n.t("create")}
            </Button>
          </Col>
        </Row>
      );
    };
    render() {
        const { isShowModal, mode, currentDebt, data, loading } = this.state;
        const columns = [
          {
            title: i18n.t("INDEX"),
            dataIndex: "idx",
            key: "idx",
            render: (text) => <label>{text}</label>,
          },
          {
            title: i18n.t("Debtor Name"),
            dataIndex: "debtorname",
            key: "debtorname",
            ...this.getColumnSearchProps("debtorname"),
            sorter: (a, b) => a.debtorname.length - b.debtorname.length,
            sortDirections: ["descend", "ascend"],
          },
          {
            title: i18n.t("Note"),
            dataIndex: "note",
            key: "note",
            ...this.getColumnSearchProps("note"),
            sorter: (a, b) => a.note.length - b.note.length,
            sortDirections: ["descend", "ascend"],
          },
          {
            title: i18n.t("Money"),
            dataIndex: "money",
            key: "money",
            ...this.getColumnSearchProps("money"),
            sorter: (a, b) => a.money - b.money,
            sortDirections: ["descend", "ascend"],
            render: (money) => (
              <NumberFormat
                value={money}
                displayType={"text"}
                thousandSeparator={true}
              />
            ),
          },
          {
            title: i18n.t("Created Date"),
            dataIndex: "createdDate",
            key: "createdDate",
            ...this.getColumnSearchProps("createdDate"),
            sorter: (a, b) => a.createdDate.length - b.createdDate.length,
            sortDirections: ["descend", "ascend"],
            render: (createdDate) => (
              <Moment format="DD/MM/YYYY">
                {createdDate}
              </Moment>
            ),
          },
          {
            title: i18n.t("Deadline"),
            dataIndex: "deadline",
            key: "deadline",
            ...this.getColumnSearchProps("deadline"),
            sorter: (a, b) => a.deadline.length - b.deadline.length,
            sortDirections: ["descend", "ascend"],
            render: (deadline) => (
              <Moment format="DD/MM/YYYY">
                {deadline}
              </Moment>
            ),
          },
        ];
        return (
          <Card title={this.renderTitle()}>
            {isShowModal && mode !== "" && (
              <ModalForm
                isShow={isShowModal}
                mode={mode}
                closeModal={this.closeModal}
                currentDebt={currentDebt || {}}
                loading={loading}
              />
            )}
            <Row>
              <Col style={{ overflowX: "auto" }}>
                <Table
                  bordered
                  columns={columns}
                  dataSource={data}
                  pagination={{ pageSize: 10 }}
                  scroll={{ y: 600 }}
                  loading={loading}
                />
              </Col>
            </Row>
          </Card>
        );
    }
}