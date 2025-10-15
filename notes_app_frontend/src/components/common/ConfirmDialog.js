import React from "react";

/**
 * PUBLIC_INTERFACE
 * ConfirmDialog renders a modal-like confirmation with primary/danger actions.
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onCancel}
    >
      <section
        className="main-surface"
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 16,
          borderRadius: 12,
          background: "var(--color-surface)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header style={{ fontWeight: 800, marginBottom: 8 }} id="confirm-title">
          {title}
        </header>
        <div className="small-muted" id="confirm-message" style={{ marginBottom: 16 }}>
          {message}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "transparent",
              color: "var(--color-primary)",
              border: "1px solid var(--color-primary)",
              padding: "8px 14px",
              borderRadius: 8,
              fontWeight: 700,
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: "var(--color-error)",
              color: "#fff",
              border: "1px solid var(--color-error)",
              padding: "8px 14px",
              borderRadius: 8,
              fontWeight: 700,
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            {confirmText}
          </button>
        </div>
      </section>
    </div>
  );
}
