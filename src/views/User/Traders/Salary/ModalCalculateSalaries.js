import React, {useState, useEffect} from "react";
import {Table,Modal} from "antd";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";

const ModalCalculateSalaries = ({isShow, closeModal,baseSalaries}) => {
  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    setLoading(false);
  };
  const columns = [
    {
      title: i18n.t("salary"),
      dataIndex: "salary",
      key: "salary",
      render: (salary) => salary !== null ? <Widgets.NumberFormat value={salary} /> : "Không có thông tin",
    },
    {
      title: i18n.t("dateStart"),
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => {
        let date=new Date(startDate);
        return date.getMonth()+"/"+date.getFullYear();
      },
    },
    {
      title: i18n.t("dateEnd"),
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => {
        let date=new Date(endDate);
        return endDate==null? "Chưa có": date.getMonth()+"/"+date.getFullYear();
      },
    },
  ];
  return (
    <Modal
      title="Demo"
      footer=""
      visible={isShow}
      onCancel={closeModal}
      loading={loading}
    >
      <Table
        bordered
        columns={columns}
        dataSource={baseSalaries}
        pagination={{pageSize: 10}}
        scroll={{y: 600}}
      />
    </Modal>
  );
};

export default ModalHistorySalaries;
