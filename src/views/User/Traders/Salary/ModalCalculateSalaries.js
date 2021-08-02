import React, {useState, useEffect} from "react";
import {Table, Modal, Button} from "antd";
import session from "../../../../services/session";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import moment from "moment";
import apis from "../../../../services/apis";

const ModalCalculateSalaries = ({isShow, closeModal,data, date = moment()}) => {
  const [calculate, setCalculate] = useState(data.filter(item=>item.salary===null&&item.baseSalary!==null).map(item => {
    item.salary = item.baseSalary * item.status - item.advanceSalary
    return item;
  }));
  console.log(calculate)
  const handleChange = (id, value) => {
    let salary = calculate.find(item => item.id === id);
    salary.salary = value;
    setCalculate(calculate);
  };
  const handleOk = async () => {
    let list = [];
    for (let i = 0; i < calculate.length; i++) {
      let item = calculate[i];
      list.push({dateStart: date._d, salary: item.salary, empId: item.id})
    }
    await apis.createEmpHistorySalary(list, "POST");
    closeModal(true);
  };
  const columns = [
    {
      title: i18n.t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: i18n.t("status-tk"),
      dataIndex: "status",
      key: "status",
    },
    {
      title: i18n.t("Base Salary") + "(VND)",
      dataIndex: "baseSalary",
      key: "baseSalary",
      render: (salary) => <Widgets.NumberFormat value={salary} needSuffix={false} />,
    },
    {
      title: i18n.t("Advance Salary") + "(VND)",
      dataIndex: "advanceSalary",
      key: "advanceSalary",
      render: (salary) => <Widgets.NumberFormat value={salary} />,
    },
    {
      title: i18n.t("salary-tk") + "(VND)",
      render: (data) => {
        return <Widgets.MoneyInput defaultValue={data.salary} value={data.salary} onChange={(e) => handleChange(data.id, e)} />
      },
    },
  ];
  return (
    <Modal
      width={900}
      title="Tính lương"
      footer={<Button type='primary' onClick={handleOk}>Lưu</Button>}
      visible={isShow}
      onCancel={()=>closeModal(true)}
    >
      <Table
        bordered
        columns={columns}
        dataSource={calculate}
        pagination={{pageSize: 10}}
        scroll={{y: 600}}
      />
    </Modal>
  );
};

export default ModalCalculateSalaries;
