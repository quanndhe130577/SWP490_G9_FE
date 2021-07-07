import React, { useState } from "react";
import { Input, InputNumber } from "antd";
import NumberFormat from "react-number-format";

export default function Money({
    value,
    label,
    error,
    isDisable = false,
    onChange,
    required = false,
    submitted,
    onKeyDown,
}) {
    const _formatNumber = (num) => {
        return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    };

    const [number, setNumber] = useState(0);

    return (
        <div className={"form-group " + (submitted && !value ? " has-error" : "")} style={{ display: "flex", flexDirection: "column" }}>
            {label && (
                <label className="bold">
                    {label} {required ? <span style={{ color: "red" }}>*</span> : ""}
                </label>
            )}

            <InputNumber
                style={{ width: "100%" }}
                disabled={isDisable}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                required={required}
                onChange={(e) => {
                    console.log(e)
                    onChange(e)
                }}
            />
            {submitted && !value && (
                <div className="help-block">{label} is required</div>
            )}
            {submitted && !error && <div className="help-block">{error}</div>}
        </div>
    );
}
