import React from "react";

export default function Number({
  value,
  label,
  error,
  isDisable = false,
  onChange,
  required = false,
  submitted,
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
        type="text"
        className="form-control"
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        onBlur={(e) => {
          let regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
          if (!regex.test(e.target.value)) {
            return { isValid: false, message: 'Số điện thoại không đúng' };
          }
          return { isValid: true, message: '' };
        }}
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
