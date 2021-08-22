import React from "react";
import { Line } from "@ant-design/charts";
import { helper } from "../../../services";
import i18n from "i18next";
import moment from "moment";
import { Row, Col } from "reactstrap";
import Widgets from "../../../schema/Widgets";

const DemoLine = ({ dailyData, data }) => {
  let config = {
    data: dailyData,
    xField: "date",
    yField: "value",
    seriesField: "name",
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return v / 1000000 + " " + i18n.t("M");
        },
      },
    },
    xAxis: {
      label: {
        formatter: function formatter(v) {
          return helper.getDateFormat(moment(v, "DD/MM/YYYY"), "dd");
        },
      },
    },
    legend: { position: "top" },
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 3000,
      },
    },
    // or seriesField in some cases
    color: ({ name }) => {
      if (name === "Tổng nợ") {
        return "#FA686F";
      } else if (name === "Tổng thu") {
        return "#55A6BC";
      } else if (name === "Tổng chi") {
        return "#73BF73";
      }
    },
  };

  return (
    <Row>
      <Col md="12" className="mb-5">
        <div className="d-flex justify-content-center">
          <Line {...config} style={{ width: "90%" }} />
        </div>
      </Col>

      <Col md="6">
        <div style={{ marginLeft: "10%" }}>
          <Widgets.NumberFormat
            label={i18n.t("summaryIncome") + ": "}
            value={data.summaryIncome}
          />
          <Widgets.NumberFormat
            label={i18n.t("summaryOutcome") + ": "}
            value={data.summaryOutcome}
          />
        </div>
      </Col>
      <Col md="6">
        <div style={{ marginLeft: "10%" }}>
          <Widgets.NumberFormat
            label={i18n.t("summaryDailyCost") + ": "}
            value={data.summaryDailyCost}
          />
          <Widgets.NumberFormat
            label={i18n.t("tienPhaiThu") + ": "}
            value={data.tienPhaiThu}
          />
          <Widgets.NumberFormat
            label={i18n.t("tienPhaiTra") + ": "}
            value={data.tienPhaiTra}
          />
        </div>
      </Col>
    </Row>
  );
};
export default DemoLine;
