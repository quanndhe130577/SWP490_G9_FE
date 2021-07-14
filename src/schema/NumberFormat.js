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
  prefix = '',
  neddFormGroup = true,
  className = ''
}) {
  function onValueChange(e) {
    if (onChange && !isDisable) onChange(e);
  }
  return (
    <div className={(submitted && !value ? " has-error" : "") + ` ${className}`}>
      {label && (
        <label className="bold">
          {label} {required ? <span style={{color: "red"}}>*</span> : ""}
        </label>
      )}

      <NumberFormat
        prefix={prefix}
        value={value || 0}
        displayType={displayType}
        thousandSeparator={true}
        suffix={"VND"}
        onValueChange={onValueChange}
      />
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
    </div>
  );
}
