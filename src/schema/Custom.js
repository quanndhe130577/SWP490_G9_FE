import React from "react";

export default function Custom({ label, component }) {
  return (
    <div className="form-group">
      {label && <label className="bold">{label}</label>}
      <div className="form-group">{component}</div>
    </div>
  );
}
