import React from "react";
import { Checkbox } from "antd";

export default function Checkbox1({
  value = false,
  label,
  error,
  disabled = false,
  onChange,
  lblCheckbox,
  required = false,
  submitted,
  lblChecked,
}) {
  function renderLabe(valueC, lblCheckedC, txt) {
    if (lblChecked) {
      if (valueC) {
        txt = lblCheckedC;
      }
    }
    return txt;
  }
  return (
    <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
      {label && (
        <label className="bold" style={{ width: "100%" }}>
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}

      <Checkbox
        checked={value}
        disabled={disabled}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.checked);
          }
        }}
      >
        {renderLabe(value, lblChecked, lblCheckbox || label)}
      </Checkbox>
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
      {submitted && !error && <div className="help-block">{error}</div>}
    </div>
  );
}
