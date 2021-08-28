import React from "react";
import { Line } from "@ant-design/charts";
import { helper, session } from "../../../services";
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
  const USER = session.get("user") || {};

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

          <label className="bold">
            <span>
              {i18n.t(USER.roleName === "Trader" ? "PROFIT" : "WCREICEVER") +
                ": "}
            </span>
            <span
              className={
                " ml-0" +
                helper.handleStyleProfit(
                  data.summaryIncome -
                    data.summaryOutcome -
                    data.summaryEmpSalary -
                    data.summaryDailyCost
                )
              }
            >
              {new Intl.NumberFormat().format(
                data.summaryIncome -
                  data.summaryOutcome -
                  data.summaryEmpSalary -
                  data.summaryDailyCost
              ) + " VND"}
            </span>
          </label>
        </div>
      </Col>
      <Col md="6">
        <div style={{ marginLeft: "10%" }}>
          <Widgets.NumberFormat
            label={i18n.t("summaryDailyCost") + ": "}
            value={data.summaryDailyCost}
          />
          {USER.roleName === "Trader" && (
            <Widgets.NumberFormat
              label={i18n.t("summaryEmpSalary") + ": "}
              value={data.summaryEmpSalary}
            />
          )}
        </div>
      </Col>
      <Col md="6">
        <div style={{ marginLeft: "10%" }}>
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
