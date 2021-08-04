import React, { useState } from "react";
import { Table, Modal, Button } from "antd";
import { Row, Col } from "reactstrap";
import Widgets from "../../../../schema/Widgets";
import apis from "../../../../services/apis";
import helper from "../../../../services/helper";
import moment from "moment";
import i18n from "i18next";

const ModalAdvanceSalaries = ({ isShow, closeModal, employeeId, name }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [advanceSalary, setAdvance] = useState({ date: moment()._d, amount: 1000 });
  console.log(data);
  const handleChange = (val, name) => {
    setAdvance((prevState) => ({
      ...prevState,
      [name]: val,
    }));
  };
  const columns = [
    {
      title: i18n.t("Amount") + "(VND)",
      dataIndex: "amount",
      key: "amount",
      render: (salary) => salary !== null ? <Widgets.NumberFormat needSuffix={false} value={salary} /> : "Không có thông tin",
    },
    {
      title: i18n.t("date"),
      dataIndex: "date",
      key: "date",
      render: (startDate) => {
        let date = new Date(startDate);
        return date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear();
      },
    },
    {
      title: i18n.t("action"),
      dataIndex: "id",
      key: "id",
      render: (id) => <Button danger type="text" onClick={() => deleteAdvanceSalary(id)}>Xoá</Button>,
    },
  ];
  let getAdvanceSalaries = async () => {
    let rs = await apis.getAllAdvanceSalary({}, "GET", employeeId);
    setData(rs.data)
  }
  let submit = async () => {
    let rs = await apis.createAdvanceSalary({ amount: advanceSalary.amount, empId: employeeId, date: advanceSalary.date }, "POST");
    if (rs) {
      helper.toast("success", i18n.t(rs.message));
      getAdvanceSalaries();
    }
  }
  let deleteAdvanceSalary = async (id) => {
    let rs = await apis.deleteAdvanceSalary({}, "POST", id);
    if (rs) {
      helper.toast("success", i18n.t(rs.message));
      getAdvanceSalaries();
    }
  }
  if (loading) {
    setLoading(false);
    getAdvanceSalaries();
  }
  return (
    <Modal
      title={i18n.t("Advance Salary") + " của " + name}
      footer=""
      visible={isShow}
      onCancel={closeModal}
    >
      <Row className="pb-2">
        <Col md="6" xs="12"><Widgets.MoneyInput label="Số tiền" defaultValue={advanceSalary.amount} value={advanceSalary.amount} onChange={value => handleChange(value, 'amount')} /></Col>
        <Col md="6" xs="12"><Widgets.DateTimePicker label="Ngày" value={advanceSalary.date} onChange={value => handleChange(new Date(value), 'date')} /></Col>
        <Col md="12" xs="12" className="d-flex justify-content-center"><Button type="primary" onClick={submit}>Tạo mới</Button></Col>
      </Row>
      <Table
        bordered
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 600 }}
      />
    </Modal>
  );
};

export default ModalAdvanceSalaries;
