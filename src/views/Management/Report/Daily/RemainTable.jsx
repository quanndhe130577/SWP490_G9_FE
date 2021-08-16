import React from "react";
import { Col } from "reactstrap";
import { Table } from "antd";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";
import NumberFormat from "react-number-format";

const RemainTable = ({ remainTotal }) => {
  return (
    <Col md="4">
      <h4 className="ml-3">{i18n.t("Remain")}</h4>
      <Table
        rowKey="idx"
        columns={columns}
        dataSource={remainTotal.remainDetails}
        bordered
        pagination={false}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell key="1" className="bold">
                {i18n.t("total")}
              </Table.Summary.Cell>
              <Table.Summary.Cell key="2" className="bold">
                <NumberFormat
                  value={remainTotal.totalWeight.toFixed(1)}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix=" Kg"
                />
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Col>
  );
};

export default RemainTable;

const columns = [
  {
    title: i18n.t("fishName"),
    dataIndex: "fishType",
    key: "fishType",
    render: (fishType) => <span>{fishType && fishType.fishName}</span>,
  },
  {
    title: i18n.t("fishWeight"),
    dataIndex: "weight",
    key: "weight",
    render: (weight) => (
      <Widgets.NumberFormat value={weight} needSuffix={false} />
    ),
  },
];
