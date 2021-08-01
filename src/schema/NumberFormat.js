import React from "react";
import NumberFormat from "react-number-format";
// refer https://www.npmjs.com/package/react-number-format
export default function NumberFormat2({
  value,
  label,
  error,
  isDisable = false,
  onChange,
  displayType = "text",
  required = false,
  submitted,
  format,
  prefix = "",
  needFormGroup = true,
  className = "",
  needSuffix = true,
}) {
  function onValueChange(e) {
    if (onChange && !isDisable) onChange(e);
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
        suffix={needSuffix ? " VND" : ""}
        onValueChange={onValueChange}
      />
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
    </div>
  );
}
