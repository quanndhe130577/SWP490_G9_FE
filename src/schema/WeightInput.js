import React from "react";
import { Input } from "antd";
import i18n from "i18next";

export default function Number({
  value,
  label,
  error,
  isDisable = false,
  onChange,
  required = false,
  submitted,
  onKeyDown,
  placeholder,
  className,
}) {
  return (
    <div
      className={
        "form-group " +
        ` ${className}` +
        (submitted && !value ? " has-error" : "")
      }
      style={{ margin: "auto" }}
    >
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}

      <Input
        disabled={isDisable}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (onChange) {
            let v = e.target.value.replace(/[^0-9.]/, "");
            if (v.startsWith(0)) {
              v = parseInt(v, 10);
            }
            onChange(v);
          }
        }}
        onBlur={(e) => {
          if (onChange) {
            let val = e.target.value;
            val = val.replace(/([^0-9.]+)/, "");
            val = val.replace(/^(0|\.)/, "");
            const match = /(\d{0,3})[^.]*((?:\.\d{0,1})?)/g.exec(val);
            let value = match[1] + match[2];

            if (val.length > 0) {
              let tem = parseFloat(value).toFixed(1);
              onChange(tem);
            } else {
              onChange(0);
            }
          }
        }}
        onKeyDown={onKeyDown}
        required={required}
      />
      {submitted && !value && (
        <div className="help-block">{i18n.t("isRequired") + " " + label}</div>
      )}
      {submitted && !error && <div className="help-block">{error}</div>}
    </div>
  );
}
