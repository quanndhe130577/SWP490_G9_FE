import React, { useEffect, useState } from "react";
import { helper, apis, session } from "../../../../services";
import Loading from "../../../../containers/Antd/LoadingCustom";
import { Row, Col } from "reactstrap";
import { Card } from "antd";
import i18n from "i18next";
import Widgets from "../../../../schema/Widgets";

import Chart from "../Chart";

const ReportMonthly = () => {
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [dailyData, setDailyData] = useState({
    listTraderData: [],
    listWRData: [],
  });
  const user = session.get("user");

  async function fetchData(date) {
    try {
      setLoading(true);
      setDate(date);
      date = helper.getDateFormat(date, "MMyyyy");
      let rs = await apis.reportMonth({}, "GET", date);
      if (rs && rs.statusCode === 200) {
        setData(rs.data);
        setDailyData(rs.data.dailyData);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData(new Date());
  }, []);

  const renderTitle = () => {
    return (
      <Row>
        <Col md="6" className="d-flex">
          <h4 className="">{i18n.t("report.in-out-come-month")}</h4>
        </Col>
      </Row>
    );
  };
  if (loading) {
    return <Loading />;
  } else
    return (
      <Card title={renderTitle()} className="body-minH">
        <Row>
          <b className="mr-2 mt-2 ml-5">{i18n.t("selectMonth")}</b>
          <Widgets.DateTimePicker
            value={date}
            picker="month"
            needCorrect={false}
            onChange={(value) => {
              fetchData(value);
            }}
            dateFormat="MM-YYYY"
          />
        </Row>
        <Row>
          <Col md="12">
            {user.roleName === "Trader" ? (
              <Chart dailyData={dailyData.listTraderData} data={data} />
            ) : (
              <Chart dailyData={dailyData.listWRData} />
            )}
          </Col>
        </Row>
      </Card>
    );
};

export default ReportMonthly;
