import React from "react";
// import DatePicker from "react-datepicker";
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
  let dateFormat = "MM/DD/yyyy";
  return (
    <div
      className={
        "form-group d-flex flex-column" +
        (submitted && !value ? " has-error" : "")
      }
    >
      {label && (
        <label className="bold">
          {label} {required ? <span>*</span> : ""}
        </label>
      )}

      <DatePicker
        className="form-control"
        defaultValue={moment(value.toLocaleDateString().trim(), dateFormat)}
        format={dateFormat}
        onChange={(date, dateString) => {
          if (onChange) {
            onChange(date);
          }
        }}
      />
      {/* <DatePicker
        className="form-control"
        dateFormat="dd/MM/yyyy"
        // maxDate={maxDate}
        // minDate={minDate}
        // isClearable
        selected={value}
        onChange={(data) => {
          if (onChange) {
            onChange(data);
          }
        }}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        required={required}
        showPopperArrow={false}
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [5, 10],
            },
          },
          {
            name: "preventOverflow",
            options: {
              rootBoundary: "viewport",
              tether: false,
              altAxis: true,
            },
          },
        ]}
      /> */}
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
    </div>
  );
}
