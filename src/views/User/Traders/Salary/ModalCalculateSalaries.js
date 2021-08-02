import React, {useState, useEffect} from "react";
import {Table, Modal, Input} from "antd";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";

const ModalCalculateSalaries = ({isShow, closeModal, data}) => {
  console.log(data)
  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    setLoading(false);
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
      render: (data) => <Widgets.MoneyInput value={data.baseSalary * data.status - data.advanceSalary} />,
    },
  ];
  return (
    <Modal
      width={900}
      title="Demo"
      footer=""
      visible={isShow}
      onCancel={closeModal}
      loading={loading}
    >
      <Table
        bordered
        columns={columns}
        dataSource={data}
        pagination={{pageSize: 10}}
        scroll={{y: 600}}
      />
    </Modal>
  );
};

export default ModalCalculateSalaries;
