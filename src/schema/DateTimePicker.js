import React from "react";
import DatePicker from "react-datepicker";

export default function DateTimePicker({
  value,
  label,
  // maxDate,
  // minDate,
  error,
  isDisable = false,
  onChange,
  type = "text",
  required = false,
  submitted,
}) {
  console.log(value);
  return (
    <div
      className={
        "form-group  d-flex flex-column" +
        (submitted && !value ? " has-error" : "")
      }
    >
      {label && (
        <label className="bold">
          {label} {required ? <span>*</span> : ""}
        </label>
      )}

      {/* <input
        disabled={isDisable}
        type={type}
        className="form-control"
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        required={required}
      /> */}
      <DatePicker
        className="form-control"
        dateFormat="dd/MM/yyyy"
        // maxDate={maxDate}
        // minDate={minDate}
        isClearable
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
      />
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
    </div>
  );
}
