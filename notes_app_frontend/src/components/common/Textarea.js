import React from "react";

/**
 * PUBLIC_INTERFACE
 * Textarea with Ocean Professional focus/hover styles.
 */
export default function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 8,
  disabled = false,
  ...rest
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      {...rest}
      style={{
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid rgba(0,0,0,0.15)",
        background: "var(--color-surface)",
        resize: "vertical",
        transition: "border-color .15s ease, box-shadow .15s ease",
      }}
      onFocus={(e) => (e.currentTarget.style.boxShadow = "var(--focus-ring)")}
      onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.25)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)")}
    />
  );
}
