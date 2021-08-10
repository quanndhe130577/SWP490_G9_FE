import React, { useEffect, useState } from "react";
import { Select } from "antd";
import i18next from "i18next";
const { Option } = Select;

const Select2 = ({
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
  containLbl,
}) => {
  const [options, setOptions] = useState(items);
  let valueTem = items.find((el) => el.value === value || el.id === value || el.saveField === value);
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
    setOptions(data);
  }, [items, displayField, containLbl]);

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
        placeholder={i18next.t("pleaseChoose")}
        onChange={(v) => {
          let val = v;
          if (val === "") val = null;
          if (onChange) {
            onChange(val);
          }
        }}
      >
        {/* {needPleaseChose && (
          <Option value="" key="-1">
            {i18next.t("pleaseChoose")}
          </Option>
        )} */}
        {options.map((item, index) => (
          <Option value={item.value || item[saveField]} key={index}>
            {item.label || item[displayField] || item.type}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Select2;
