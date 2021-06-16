import React, { Component } from "react";
import { Select } from "antd";
import i18n from "i18next";

const { Option } = Select;
class SelectSearchMulti extends Component {
  render() {
    const {
      value,
      label,
      required,
      isDisable,
      submitted,
      onChange,
      onBlur,
      items = [],
    } = this.props;

    return (
      <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
        {label && (
          <label className="bold">
            {label} {required ? <span>*</span> : ""}
          </label>
        )}

        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder={i18n.t("pleaseSelect")}
          defaultValue={value}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={isDisable}
        >
          {items.map((it) => (
            <Option key={it.value}>{it.label}</Option>
          ))}
        </Select>
      </div>
    );
  }
}

export default SelectSearchMulti;
