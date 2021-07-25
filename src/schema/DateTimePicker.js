import React from "react";
import { DatePicker } from "antd";
import moment from "moment";

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
        // defaultValue={moment(value, dateFormat)}
        defaultValue={moment(value, dateFormat)}
        format={dateFormat}

        onChange={(date, dateString) => {

          if (onChange) {
            onChange(date);
          }
        }}
      />

      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
    </div>
  );
}
