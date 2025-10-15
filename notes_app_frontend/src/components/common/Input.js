import React from "react";

/**
 * PUBLIC_INTERFACE
 * Input with Ocean Professional focus/hover styles.
 */
export default function Input({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  ...rest
}) {
  return (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      disabled={disabled}
      {...rest}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid rgba(0,0,0,0.15)",
        background: "var(--color-surface)",
        transition: "border-color .15s ease, box-shadow .15s ease",
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = "var(--focus-ring)")}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.25)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)")}
    />
  );
}
