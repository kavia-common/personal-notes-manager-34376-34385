import React from "react";

/**
 * PUBLIC_INTERFACE
 * Button component with variants and sizes for the Ocean theme.
 */
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  ariaLabel,
}) {
  const variants = {
    primary: {
      background: "var(--color-primary)",
      color: "#fff",
      border: "1px solid var(--color-primary)",
    },
    secondary: {
      background: "transparent",
      color: "var(--color-primary)",
      border: "1px solid var(--color-primary)",
    },
    danger: {
      background: "var(--color-error)",
      color: "#fff",
      border: "1px solid var(--color-error)",
    },
  };

  const sizes = {
    sm: { padding: "6px 10px", fontSize: 12 },
    md: { padding: "8px 14px", fontSize: 14 },
    lg: { padding: "10px 18px", fontSize: 16 },
  };

  const style = {
    ...variants[variant],
    ...sizes[size],
    borderRadius: 8,
    fontWeight: 700,
    boxShadow: "var(--shadow-sm)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "transform .12s ease, box-shadow .12s ease, opacity .2s ease",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      style={style}
      onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(1px)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      onBlur={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {children}
    </button>
  );
}
