import React from "react";
import { InputNumber } from "antd";

export default function Money({
  defaultValue = 0,
  value = null,
  label,
  error,
  disabled = false,
  onChange,
  required = false,
  submitted,
  min = 0,
  onKeyDown,
  placeholder = 0,
  step = 100,
}) {
  //  console.log("number " + value);
  //const [inputValue, setInputValue] = useState(value);

  return (
    <div
      className={
        label && "form-group " + (submitted && !value ? " has-error" : "")
      }
      style={{ display: "flex", flexDirection: "column" }}
    >
      {label && (
        <label className="bold">
          {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
        </label>
      )}

      <InputNumber
        style={{ width: "100%" }}
        disabled={disabled}
        defaultValue={defaultValue}
        step={step}
        //value={inputValue}
        value={value}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        required={required}
        min={min}
        placeholder={placeholder}
        onChange={(e) => {
          let value = e;
          if (parseInt(value) < 0 || value == null) {
            value = 0;
          }

          //setInputValue(value);
          if (onChange) {
            onChange(value);
          }
        }}
      />
      {submitted && !value && (
        <div className="help-block">{label} is required</div>
      )}
      {submitted && !error && <div className="help-block">{error}</div>}
    </div>
  );
}
