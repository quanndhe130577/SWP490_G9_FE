import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { Table, Modal, Button } from "antd";
import Widgets from "../../../../schema/Widgets";
import helper from "../../../../services/helper";
import apis from "../../../../services/apis";
import moment from "moment";
import i18n from "i18next";

const ModalBaseSalaries = ({
  isShow,
  closeModal,
  baseSalaries,
  name,
  currentEmp,
}) => {
  const [salaries, setSlaries] = useState([]);
  const [salary, setSalary] = useState(currentEmp.baseSalary);

  const columns = [
    {
      title: i18n.t("salary") + "(VND)",
      dataIndex: "salary",
      key: "salary",
      render: (salary) =>
        salary !== null ? (
          <Widgets.NumberFormat needSuffix={false} value={salary} />
        ) : (
          "Không có thông tin"
        ),
    },
    {
      title: i18n.t("dateStart"),
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => {
        let date = moment(new Date(startDate));
        date.startOf("month");
        return date.format("DD/MM/YYYY");
      },
    },
    {
      title: i18n.t("dateEnd"),
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => {
        if (endDate) {
          let date = moment(new Date(endDate));
          date.endOf("month");
          return date.format("DD/MM/YYYY");
        } else {
          return "Chưa có thông tin";
        }
      },
    },
  ];
  let getBaseSalaries = async () => {
    let rs = await apis.getBaseSalariesByEmployeeId({}, "GET", currentEmp.id);
    setSlaries(rs.data);
  };
  const handleOk = async () => {
    try {
      let rs = await apis.updateEmployeeBaseSalary({
        salary: salary,
        empId: currentEmp.id,
      });
      if (rs && rs.statusCode === 200) {
        helper.toast("success", i18n.t(rs.message || "success"));
        getBaseSalaries();
      }
    } catch (error) {
      helper.toast("error", i18n.t("systemError"));
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getBaseSalaries(), []);
  return (
    <Modal
      title={"Lương của " + name}
      footer=""
      visible={isShow}
      onCancel={() => closeModal(true)}
    >
      <Row className="pb-3">
        <Col md="6" xs="12">
          <Widgets.MoneyInput
            required={true}
            value={salary}
            defaultValue={salary}
            onChange={(e) => setSalary(e)}
          />
        </Col>
        <Col md="6" xs="12">
          <Button type="primary" onClick={handleOk}>
            Lưu
          </Button>
        </Col>
      </Row>
      <Table
        bordered
        columns={columns}
        dataSource={salaries}
        pagination={{ pageSize: 10 }}
        scroll={{ y: 600 }}
      />
    </Modal>
  );
};

export default ModalBaseSalaries;
