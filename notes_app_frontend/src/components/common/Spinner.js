import React from "react";

/**
 * PUBLIC_INTERFACE
 * Spinner provides a subtle loading indicator with Ocean theme styling.
 */
export default function Spinner({ size = 18, label = "Loading…" }) {
  const border = "3px";
  const dim = typeof size === "number" ? size : 18;
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
    >
      <span
        aria-hidden
        style={{
          width: dim,
          height: dim,
          borderRadius: "999px",
          border: `${border} solid rgba(0,0,0,0.1)`,
          borderTop: `${border} solid var(--color-primary)`,
          animation: "spin 0.9s linear infinite",
          display: "inline-block",
        }}
      />
      {label && <span className="small-muted">{label}</span>}
      {/* Local keyframes fallback if not provided globally */}
      <style>
        {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}
