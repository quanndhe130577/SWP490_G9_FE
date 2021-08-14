import React from "react";
import { DatePicker } from "antd";
import moment from "moment";
import "moment/locale/vi";
import locale from "antd/lib/locale/vi_VN";
import { helper } from "../services";
import i18next from "i18next";
export default function DateTimePicker({
  value,
  label,
  error,
  isDisable = false,
  onChange,
  required = false,
  submitted,
  needCorrect = true,
  picker,
  needDisabledDate = true,
  dateFormat = "DD/MM/yyyy",
}) {
  function disabledDate(current) {
    return current && current > moment().endOf("day");
  }
  return (
    <div
      className={
        "form-group d-flex flex-column" +
        (submitted && !value ? " has-error" : "")
      }
    >
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}

      <DatePicker
        picker={picker}
        locale={locale}
        defaultValue={moment(value, dateFormat)}
        format={dateFormat}
        disabled={isDisable}
        onChange={(date) => {
          if (onChange) {
            if (date !== null && needCorrect) {
              date = helper.correctDate(date);
            }
            onChange(date);
          }
        }}
        disabledDate={needDisabledDate && disabledDate}
      />

      {submitted && !value && (
        <div className="help-block">
          {i18next.t("isRequired") + " " + label}
        </div>
      )}
    </div>
  );
}
