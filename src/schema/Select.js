import React, { Component } from "react";
import { Select } from "antd";
import i18next from "i18next";
const { Option } = Select;

class Select2 extends Component {
  render() {
    const {
      width = "100%",
      value,
      label,
      required,
      isDisable,
      submitted,
      onChange,
      items = [],
      displayField = "name",
      saveField = "id",
      needPleaseChose = true,
    } = this.props;
    let valueTem = items.find((el) => el.value === value || el.id === value);
    return (
      <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
        {label && (
          <label className="bold">
            {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
          </label>
        )}
        &nbsp;
        <Select
          // defaultValue={value}
          value={valueTem && (valueTem.value || valueTem.id || "")}
          style={{ width: width }}
          disabled={isDisable}
          onChange={(v) => {
            let val = v;
            if (val === "") val = null;
            if (onChange) {
              onChange(val);
            }
          }}
        >
          {needPleaseChose && (
            <Option value="" key="-1">
              {i18next.t("pleaseChoose")}
            </Option>
          )}
          {items.map((item, index) => (
            <Option value={item.value || item[saveField]} key={index}>
              {item.label || item[displayField] || item.type}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default Select2;
