import React, { Component } from "react";
import { Calendar, Badge, Modal } from "antd";
import "./TimeKeeping.css";

export default class TimeKeeping extends Component {
  constructor(props) {
    super(props);
    this.state = { isShow: false };
  }
  random(start, end) {
    return Math.floor(Math.random() * end) + start;
  }
  getListData = (value) => {
    // console.log(value.date());
    let colors = [
      "pink",
      "red",
      "yellow",
      "orange",
      "cyan",
      "green",
      "blue",
      "purple",
      "geekblue",
      "magenta",
      "volcano",
      "gold",
      "volcano",
    ];
    let i1 = this.random(0, 4);
    let i2 = this.random(0, 12);
    let names = ["Tiến Anh", "Bằng", "Tâm", "Quân", "Anh đức"];
    let listData = [];
    listData.push({ type: colors[i1], content: names[i2] });
    console.log(i1 + " " + i2);
    return listData;
  };

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge color={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  getMonthData = (value) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };
  select(date) {
    let d = new Date();
    d.getDate();
    console.log(date._d);
  }
  render() {
    return (
      <>
        <Calendar
          dateCellRender={this.dateCellRender}
          monthCellRender={this.monthCellRender}
          onSelect={this.select}
        />
        <Modal title="Basic Modal" visible={this.state.isShow}></Modal>
      </>
    );
  }
}
