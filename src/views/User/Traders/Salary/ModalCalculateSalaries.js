import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "antd";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import moment from "moment";
import apis from "../../../../services/apis";

const ModalCalculateSalaries = ({ isShow, closeModal, date = moment() }) => {
  const [calculate, setCalculate] = useState([]);
  let month = moment(date).endOf("month").format("D");
  const handleChange = (id, value, name) => {
    let list = [];
    list.push(...calculate);
    let salary = list.find((c) => c.id === id);
    salary[name] = value;
    salary.salary = Math.round(
      (salary.baseSalary * salary.status) / month +
        salary.bonus -
        salary.advanceSalary -
        salary.punish
    );
    setCalculate(list);
  };
  const handleOk = async () => {
    let list = [];
    for (let i = 0; i < calculate.length; i++) {
      let item = calculate[i];
      list.push({
        dateStart: date._d,
        salary: item.salary,
        empId: item.id,
        punish: item.punish,
        bonus: item.bonus,
      });
    }
    await apis.createEmpHistorySalary(list, "POST");
    closeModal(true);
  };
  let fetchEmployee = async () => {
    let rs = await apis.getSalaryDetailEmployee(
      {},
      "GET",
      date._d.toDateString()
    );
    if (rs) {
      setCalculate(
        rs.data
          .filter((item) => item.baseSalary !== null)
          .map((item) => {
            item.salary = Math.round(
              (item.baseSalary * item.status) / month +
                item.bonus -
                item.advanceSalary -
                item.punish
            );
            return item;
          })
      );
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchEmployee(), []);
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
      render: (salary) => (
        <Widgets.NumberFormat value={salary} needSuffix={false} />
      ),
    },
    {
      title: i18n.t("Advance Salary") + "(VND)",
      dataIndex: "advanceSalary",
      key: "advanceSalary",
      render: (salary) => (
        <Widgets.NumberFormat value={salary} needSuffix={false} />
      ),
    },
    {
      title: i18n.t("bonus") + "(VND)",
      key: "bonus",
      render: (data) => {
        return (
          <Widgets.MoneyInput
            defaultValue={data.bonus}
            value={data.bonus}
            onChange={(e) => handleChange(data.id, e, "bonus")}
          />
        );
      },
    },
    {
      title: i18n.t("punish") + "(VND)",
      key: "bonus",
      render: (data) => {
        return (
          <Widgets.MoneyInput
            defaultValue={data.punish}
            value={data.punish}
            onChange={(e) => handleChange(data.id, e, "punish")}
          />
        );
      },
    },
    {
      title: i18n.t("salary") + "(VND)",
      dataIndex: "salary",
      key: "salary",
      render: (salary) => (
        <Widgets.NumberFormat needSuffix={false} value={salary} />
      ),
    },
  ];
  return (
    <Modal
      width={1200}
      title="Tính lương"
      footer={
        <Button type="primary" onClick={handleOk}>
          Lưu
        </Button>
      }
      visible={isShow}
      onCancel={closeModal}
    >
      <Table
        bordered
        columns={columns}
        dataSource={calculate}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 600 }}
      />
    </Modal>
  );
};

export default ModalCalculateSalaries;
