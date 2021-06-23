import React from "react";

export default function Number({
  value,
  label,
  error,
  isDisable = false,
  onChange,
  min = "0.5",
  max,
  required = false,
  submitted,
  onKeyDown
}) {
  return (
    <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}

      <input
        disabled={isDisable}
        type="number"
        className="form-control"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        onKeyDown={onKeyDown}
        required={required}
      />
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
      {submitted && !error && (
        <div className="help-block">{error}</div>
      )}

    </div>
  );
}
