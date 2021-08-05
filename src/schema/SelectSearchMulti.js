import React, { useEffect, useState } from "react";
import { Select } from "antd";
import i18n from "i18next";
const { Option } = Select;

const SelectSearchMulti = ({
  value,
  label,
  required,
  isDisable,
  submitted,
  onChange,
  items = [],
  displayField = "name",
  saveField = "id",
  containLbl,
  onBlur,
}) => {
  const [options, setOptions] = useState(items);
  const [valueA, setValueA] = useState(value);

  useEffect(() => {
    let data = [...items];
    if (displayField && Array.isArray(displayField)) {
      for (const ele of data) {
        // check  display field is array then convert to string
        let temStr = "";
        for (const field of displayField) {
          if (containLbl && field === containLbl.field) {
            temStr +=
              "(" +
              containLbl.text +
              ele[field] +
              " " +
              containLbl.suffix +
              " ) ";
          } else temStr += ele[field] + "  ";
        }
        ele.label = temStr;
      }
    }

    if (saveField === "id" && Array.isArray(value)) {
      debugger;

      let temArr = [];
      for (let ele of valueA) {
        temArr.push(parseInt(ele));
      }
      setValueA(temArr);
    }
    setOptions(data);
  }, [items, displayField, containLbl, saveField, value, valueA]);

  return (
    <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}
      &nbsp;
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder={i18n.t("pleaseSelect")}
        defaultValue={valueA}
        value={valueA}
        onChange={(e) => {
          let a = Array.from(new Set(e));
          onChange(a);
        }}
        onBlur={onBlur}
        disabled={isDisable}
      >
        {options.map((item, index) => (
          <Option value={item[saveField] || item.value} key={index}>
            {item[displayField] || item.label || item.type}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectSearchMulti;
