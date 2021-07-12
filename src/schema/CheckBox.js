import React from "react";
import { Checkbox } from "antd";

export default function Checkbox1({
  value = false,
  label,
  error,
  isDisable = false,
  onChange,
  lblCheckbox,
  required = false,
  submitted,
  onKeyDown,
}) {
  return (
    <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
      {label && (
        <label className="bold" style={{ width: "100%" }}>
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}

      <Checkbox
        checked={value}
        disabled={isDisable}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.checked);
          }
        }}
      >
        {lblCheckbox || label}
      </Checkbox>
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
      {submitted && !error && <div className="help-block">{error}</div>}
    </div>
  );
}
