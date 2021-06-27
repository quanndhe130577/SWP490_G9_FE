import React, { Component } from "react";
import { Table, Input, Space, Card, Dropdown, Menu } from "antd";
// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Row, Col, Button } from "reactstrap";
import i18n from "i18next";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import session from "../../../../services/session";
import ModalForm from "./ModalForm";
import Moment from "react-moment";
export default class Employee extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: "",
            searchedColumn: "",
            isShowModal: false,
            mode: "",
            data: [],
            loading: true
        };


    }


    componentDidMount() {
        this.fetchEmployee();
    }

    async fetchEmployee() {
        try {
            let user = await session.get("user");
            let rs = await apis.getEmployees({}, "GET");

            // let rs = await apis.getPondOwnerByTraderId({}, "GET", user.userID);
            if (rs && rs.statusCode === 200) {
                rs.data.map((el, idx) => (el.idx = idx + 1));
                console.log(rs.data)
                this.setState({ data: rs.data, user, total: rs.data.length });
            }
        } catch (error) {
            console.log(error)
        } finally {
            this.setState({ loading: false })
        }
    }


    renderTitle = () => {
        let { total } = this.state || 0;
        return (
            <Row>
                <Col md="6" className="d-flex">
                    <h3 className="">{i18n.t("EmployeeManagement")}</h3>
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

    renderBtnAction(id) {
        return (
            <Menu>
                <Menu.Item>
                    <Button
                        color="info"
                        className="mr-2"
                        onClick={() => this.onClick("edit", id)}
                    >
                        <i className="fa fa-pencil-square-o mr-1" />
                        {i18n.t("edit")}
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button color="danger" onClick={() => this.onClick("delete", id)}>
                        <i className="fa fa-trash-o mr-1" />
                        {i18n.t("delete")}
                    </Button>
                </Menu.Item>
            </Menu>
        );
    }
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
            this.fetchEmployee();
        }
        this.setState({ isShowModal: false, mode: "", currentEmp: {} });
    };
    onClick(modeBtn, employeeId) {
        let { currentEmp, data } = this.state;

        if (modeBtn === "edit") {
            currentEmp = data.find((el) => el.id === employeeId);
            this.setState({ currentEmp, mode: "edit", isShowModal: true });
        } else if (modeBtn === "delete") {
            helper.confirm(i18n.t("confirmDelete")).then(async (rs) => {
                if (rs) {
                    try {

                        let rs = await apis.deleteEmployee({}, "POST", employeeId);

                        if (rs && rs.statusCode === 200) {
                            helper.toast("success", rs.message || i18n.t("success"));
                            this.fetchEmployee();
                        }
                    } catch (error) {
                        console.log(error);
                        helper.toast("error", i18n.t("systemError"));
                    }
                }
            });
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
            this.state.searchedColumn === dataIndex ? (
                //   <Highlighter
                //     highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                //     searchWords={[this.state.searchText]}
                //     autoEscape
                //     textToHighlight={text ? text.toString() : ""}
                //   />
                <div>{text}</div>
            ) : (
                text
            ),
    });

    render() {
        const { isShowModal, mode, currentEmp, data, loading } = this.state;
        const columns = [
            {
                title: i18n.t("INDEX"),
                dataIndex: "idx",
                key: "idx",
                render: (text) => <label>{text}</label>,
            },
            {
                title: i18n.t("name"),
                dataIndex: "name",
                key: "name",
                ...this.getColumnSearchProps("name"),
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ["descend", "ascend"],
            },
            {
                title: i18n.t("dob"),
                dataIndex: "dob",
                key: "dob",
                ...this.getColumnSearchProps("dob"),
                sorter: (a, b) => a.dob.length - b.dob.length,
                sortDirections: ["descend", "ascend"],
                render: (date) => (
                    <Moment format="DD/MM/YYYY">
                        {date}
                    </Moment>
                ),
            },
            {
                title: i18n.t("address"),
                dataIndex: "address",
                key: "address",
                ...this.getColumnSearchProps("address"),
                sorter: (a, b) => a.address.length - b.address.length,
                sortDirections: ["descend", "ascend"],
            },
            {
                title: i18n.t("phoneNumber"),
                dataIndex: "phoneNumber",
                key: "phoneNumber",
                ...this.getColumnSearchProps("phoneNumber"),
                sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
                sortDirections: ["descend", "ascend"],
            },
            {
                title: "",
                dataIndex: "id",
                key: "id",
                render: (id) => (
                    <Dropdown overlay={this.renderBtnAction(id)}>
                        <Button>
                            <i className="fa fa-cog mr-1" />
                            {i18n.t("action")}
                        </Button>
                    </Dropdown>
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
                        currentEmp={currentEmp || {}}
                    // handleChangePondOwner={handleChangePondOwner}
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