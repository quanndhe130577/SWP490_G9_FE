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
}) {
  let dateFormat = "DD/MM/yyyy";
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
        locale={locale}
        defaultValue={moment(value, dateFormat)}
        format={dateFormat}
        disabled={isDisable}
        onChange={(date) => {
          if (onChange) {
            if (date !== null) {
              // date = new Date(date);
              // let hoursDiff = date.getHours() - date.getTimezoneOffset() / 60;
              // let minutesDiff =
              //   (date.getHours() - date.getTimezoneOffset()) % 60;
              // date.setHours(hoursDiff);
              // date.setMinutes(minutesDiff);
              date = helper.correctDate(date);
            }
            onChange(date);
          }
        }}
      />

      {submitted && !value && (
        <div className="help-block">
          {i18next.t("isRequired") + " " + label}
        </div>
      )}
    </div>
  );
}
