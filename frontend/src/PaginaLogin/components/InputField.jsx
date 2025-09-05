import React from "react";

function InputField({
  label,
  name,
  type,
  required = false,
  value,
  onChange,
  error,
  errorMessage,
}) {
  return (
    <div className="form-field">
      <label htmlFor={name} style={{ fontFamily: "var(--font-secundaria)" }}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`form-input ${error ? "ng-invalid" : value ? "ng-valid" : ""}`}
      />
      {error && (
        <div className="error-message">
          <span style={{ fontFamily: "var(--font-secundaria)" }}>
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
}

export default InputField;
