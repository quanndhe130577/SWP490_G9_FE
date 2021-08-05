import React, {useState, useEffect} from "react";
import {Table,Modal} from "antd";
import Widgets from "../../../../schema/Widgets";
import i18n from "i18next";
import apis from "../../../../services/apis";

const ModalHistorySalaries = ({isShow, closeModal,historySalaries,name}) => {
  console.log(historySalaries)
  const columns = [
    {
      title: i18n.t("salary"),
      dataIndex: "salary",
      key: "salary",
      render: (salary) => salary !== null ? <Widgets.NumberFormat value={salary} /> : "Không có thông tin",
    },
    {
      title: i18n.t("month"),
      dataIndex: "dateStart",
      key: "dateStart",
      render: (startDate) => {
        let date=new Date(startDate);
        return date.getMonth()+"/"+date.getFullYear();
      },
    },
  ];
  return (
    <Modal
      title={"Lịch sử lương của "+name}
      footer=""
      visible={isShow}
      onCancel={closeModal}
    >
      <Table
        bordered
        columns={columns}
        dataSource={historySalaries}
        pagination={{pageSize: 10}}
        scroll={{y: 600}}
      />
    </Modal>
  );
};

export default ModalHistorySalaries;
