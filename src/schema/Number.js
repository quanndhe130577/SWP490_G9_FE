import React from "react";
import { Input } from "antd";
import helper from "../services/helper";
import i18n from "i18next";

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
  onKeyDown,
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
        // type="number"
        // min={min || "0.5"}
        // step="0.1"
        // max={max}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          // if (onChange) {
          //   const value = e.target.value.replace(/[^\d]/,'');
          //
          //   if(Number(value) !== 0) {
          //     onChange(value)
          //   }
          // }
        }}
        onBlur={(e) => {
          if (onChange) {
            let val = e.target.value;
            val = val.replace(/([^0-9.]+)/, "");
            val = val.replace(/^(0|\.)/, "");
            const match = /(\d{0,9})[^.]*((?:\.\d{0,2})?)/g.exec(val);
            let value = match[1] + match[2];

            // e.target.value = value;
            if (val.length > 0) {
              let tem = parseFloat(value).toFixed(1)
              console.log(value+" "+tem)
              // e.target.value = value.toFixed(1);
              onChange(tem);
            }else {
              onChange(0);

            }
          }
          // let value = e.target.value;
          // if (value < 0) {
          //   helper.toast("error", i18n.t("numberMustLargerThan0"));
          //   onChange(0);
          //   e.target.focus();
          // }
        }}
        onKeyDown={onKeyDown}
        required={required}
      />
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
      {submitted && !error && <div className="help-block">{error}</div>}
    </div>
  );
}
