import React from "react";
import { Line } from "@ant-design/charts";
import { helper } from "../../../services";
import i18n from "i18next";
import moment from "moment";
const DemoLine = ({ dailyData }) => {
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
        duration: 5000,
      },
    },
  };

  return <Line {...config} style={{ width: "100%" }} />;
};
export default DemoLine;
