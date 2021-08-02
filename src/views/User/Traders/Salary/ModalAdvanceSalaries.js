import React, {useState, useEffect} from "react";
import {Table,Modal} from "antd";
import Widgets from "../../../../schema/Widgets";
import moment from "moment";
import i18n from "i18next";

const ModalAdvanceSalaries = ({isShow, closeModal,data,getAdvanceSalaries}) => {
 let advanceSalary={date:moment(),amount:0}
  const [loading, setLoading] = useState(false);
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
      title={i18n.t("Advance Salary")}
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

export default ModalAdvanceSalaries;
