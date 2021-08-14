import React from "react";
import NumberFormat from "react-number-format";
import i18next from "i18next";
// refer https://www.npmjs.com/package/react-number-format
export default function NumberFormat2({
  value,
  label,
  isDisable = false,
  onChange,
  displayType = "text",
  required = false,
  submitted,
  format,
  prefix = "",
  className = "",
  needSuffix = true,
  suffix = "VND",
}) {
  function onValueChange(e) {
    if (onChange && !isDisable) onChange(e);
  }
  function renderSuffix(params) {
    if (needSuffix) {
      return " " + suffix;
    }
  }
  return (
    <div
      className={(submitted && !value ? " has-error" : "") + ` ${className}`}
    >
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}
      &nbsp;
      <NumberFormat
        prefix={prefix}
        value={value || 0}
        displayType={displayType}
        thousandSeparator={true}
        suffix={renderSuffix()}
        onValueChange={onValueChange}
      />
      {submitted && !value && (
        <div className="help-block">
          {i18next.t("isRequired") + " " + label}
        </div>
      )}
    </div>
  );
}
