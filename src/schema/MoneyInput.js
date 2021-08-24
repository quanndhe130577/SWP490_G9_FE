import React from "react";
import { InputNumber } from "antd";
import i18next from "i18next";
export default function Money({
  defaultValue = 0,
  value = 0,
  label,
  error,
  disabled = false,
  onChange,
  required = false,
  submitted,
  min = 0,
  onKeyDown,
  placeholder = 0,
  step = 100,
  className = "",
}) {
  return (
    <div
      className={
        label &&
        "form-group " + className + (submitted && !value ? " has-error" : "")
      }
      style={{ display: "flex", flexDirection: "column" }}
    >
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}

      <InputNumber
        style={{ width: "100%" }}
        disabled={disabled}
        defaultValue={defaultValue.toFixed(0)}
        step={step}
        //value={inputValue}
        value={value && value.toFixed(0)}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        required={required}
        min={min}
        placeholder={placeholder}
        onChange={(e) => {
          let value = e;
          if (parseInt(value) < 0 || value == null) {
            value = 0;
          }

          //setInputValue(value);
          if (onChange) {
            onChange(value);
          }
        }}
      />
      {submitted && !value && (
        <div className="help-block">
          {i18next.t("isRequired") + " " + label}
        </div>
      )}
      {submitted && !error && <div className="help-block">{error}</div>}
    </div>
  );
}
