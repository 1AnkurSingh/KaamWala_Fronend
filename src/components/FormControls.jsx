// src/components/FormControls.jsx
import React from "react";

export function InputField({ label, type = "text", register, name, error, placeholder }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <input
        type={type}
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        {...register(name)}
        autoComplete="off"
      />
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}

export function SelectField({ label, options = [], register, name, error }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <select className={`form-select ${error ? "is-invalid" : ""}`} {...register(name)}>
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}

export function TextAreaField({ label, rows = 4, register, name, error, placeholder }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <textarea
        rows={rows}
        className={`form-control ${error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        {...register(name)}
      />
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
}
