import React from "react";
import { Input } from "antd";
import i18n from "i18next";

export default function Text({
  value,
  label,
  error,
  isDisable = false,
  onChange,
  type = "text",
  required = false,
  submitted = false,
  onKeyDown,
  placeholder,
}) {
  return (
    <div className={"form-group" + (submitted && !value ? " has-error" : "")}>
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}

      <Input
        disabled={isDisable}
        type={type}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        placeholder={placeholder}
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
