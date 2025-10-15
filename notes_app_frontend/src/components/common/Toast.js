import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

/**
 * Toast shape:
 * { id, type: 'success'|'error'|'info', message, timeoutMs }
 */

// PUBLIC_INTERFACE
export const ToastContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * ToastProvider manages a list of toasts and renders them in a portal-like corner container.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((arr) => arr.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, { type = "info", timeoutMs = 2600 } = {}) => {
    const id = ++idRef.current;
    const toast = { id, type, message, timeoutMs };
    setToasts((arr) => [...arr, toast]);
    if (timeoutMs > 0) {
      setTimeout(() => remove(id), timeoutMs);
    }
    return id;
  }, [remove]);

  const value = useMemo(
    () => ({
      // PUBLIC_INTERFACE
      show,
      // PUBLIC_INTERFACE
      success: (msg, opts) => show(msg, { type: "success", ...(opts || {}) }),
      // PUBLIC_INTERFACE
      error: (msg, opts) => show(msg, { type: "error", ...(opts || {}) }),
      // PUBLIC_INTERFACE
      info: (msg, opts) => show(msg, { type: "info", ...(opts || {}) }),
      // PUBLIC_INTERFACE
      remove,
    }),
    [show, remove]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "grid",
          gap: 10,
          zIndex: 1000,
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/**
 * PUBLIC_INTERFACE
 * useToast returns the toast API: { show, success, error, info, remove }
 */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastItem({ toast, onClose }) {
  const stylesByType = {
    success: {
      background: "rgba(34,197,94,0.1)",
      border: "1px solid rgba(34,197,94,0.4)",
      color: "#065f46",
    },
    error: {
      background: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.4)",
      color: "#7f1d1d",
    },
    info: {
      background: "rgba(37,99,235,0.1)",
      border: "1px solid rgba(37,99,235,0.4)",
      color: "#1e3a8a",
    },
  };
  const s = stylesByType[toast.type] || stylesByType.info;

  return (
    <div
      role="status"
      style={{
        ...s,
        boxShadow: "var(--shadow-md)",
        backdropFilter: "blur(4px)",
        borderRadius: 12,
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 220,
        maxWidth: 360,
      }}
    >
      <span aria-hidden>
        {toast.type === "success" ? "✅" : toast.type === "error" ? "⛔" : "ℹ️"}
      </span>
      <div style={{ flex: 1 }}>{toast.message}</div>
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          background: "transparent",
          color: "inherit",
          border: "none",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}
