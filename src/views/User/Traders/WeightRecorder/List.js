import { SearchOutlined } from "@ant-design/icons";
import { Card, Input, Space, Table, Checkbox } from "antd";
import i18n from "i18next";
import React, { Component } from "react";
import { Button, Col, Row } from "reactstrap";
import { apis, helper } from "../../../../services";

export default class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      searchedColumn: "",
      isShowModal: false,
      mode: "",
      data: [],
      loading: false,
      searchPhone: [],
    };
  }

  componentDidMount() {
    this.fetchTrader();
  }

  async fetchTrader() {
    try {
      let rs = await apis.getWr({}, "GET");
      if (rs && rs.statusCode === 200) {
        rs.data.map((el, idx) => (el.idx = idx + 1));
        this.setState({ data: rs.data, total: rs.data.length });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loading: false });
    }
  }
  delete = async (TraderID) => {
    let wr = this.state.data.find((wr) => wr.id === TraderID);
    wr.isDeleted = true;
    let rs = await apis.updateWr(wr, "POST");
    if (rs && rs.statusCode === 200) {
      helper.toast("success", rs.message);
      await this.fetchTrader();
    }
  };
  changeChecked = async (value, id) => {
    let wr = this.state.data.find((item) => item.id === id);
    wr.isAccepted = value;
    let rs = await apis.updateWr(wr, "POST");
    if (rs && rs.statusCode === 200) {
      helper.toast("success", rs.message);
      await this.fetchTrader();
    }
  };

  renderTitle = () => {
    let { total } = this.state || 0;
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h3 className="">{i18n.t("weightRecorder")}</h3>
          <label className="hd-total">{total ? "(" + total + ")" : ""}</label>
        </Col>
      </Row>
    );
  };

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
            Tìm
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
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
  columns = [
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
      render: (name) => <label>{name}</label>,
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
      sorter: (a, b) =>
        (a?.phoneNumber ?? "").localeCompare(b?.phoneNumber ?? "", "vi", {
          sensitivity: "base",
        }),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: i18n.t("status"),
      ...this.getColumnSearchProps("isAccepted"),
      sorter: (a, b) => a,
      sortDirections: ["descend", "ascend"],
      render: (data) => {
        return (
          <Checkbox
            onChange={(event) =>
              this.changeChecked(event.target.checked, data.id)
            }
            checked={data.isAccepted}
          >
            {i18n.t("isAccepted")}
          </Checkbox>
        );
      },
    },
    {
      title: i18n.t("action"),
      render: (data) => {
        return (
          <>
            {data.canDelete && (
              <Button
                color={data.isDeleted ? i18n.t("success") : i18n.t("danger")}
                onClick={() => this.delete(data.id)}
              >
                <i className="fa fa-trash-o mr-1" />
                {data.isDeleted ? i18n.t("cancel delete") : i18n.t("delete")}
              </Button>
            )}
          </>
        );
      },
    },
  ];

  render() {
    const { data, loading } = this.state;

    return (
      <Card title={this.renderTitle()} className="body-minH">
        <Row className="mt-3">
          <Col style={{ overflowX: "auto" }}>
            <Table
              bordered
              columns={this.columns}
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
