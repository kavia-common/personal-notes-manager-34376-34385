import React from "react";

/**
 * PUBLIC_INTERFACE
 * Empty state with icon and helper text.
 */
export default function EmptyState({ title = "Nothing here yet", subtitle, action }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "var(--color-text)",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          fontSize: 36,
          marginBottom: 12,
          color: "var(--color-primary)",
        }}
        aria-hidden
      >
        📝
      </div>
      <div style={{ fontWeight: 800, marginBottom: 6 }}>{title}</div>
      {subtitle && (
        <div className="small-muted" style={{ marginBottom: 14 }}>
          {subtitle}
        </div>
      )}
      {action}
    </div>
  );
}
