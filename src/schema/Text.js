import React from "react";

export default function Text({
  value,
  label,
  error,
  isDisable = false,
  onChange,
  type = "text",
  required = false,
  submitted,
}) {
  return (
    <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
      {label && (
        <label className="bold">
          {label} {required ? <span>*</span> : ""}
        </label>
      )}

      <input
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
      />
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
    </div>
  );
}
