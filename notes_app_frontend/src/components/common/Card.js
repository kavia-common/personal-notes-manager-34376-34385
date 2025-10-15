import React from "react";

/**
 * PUBLIC_INTERFACE
 * Card component to provide a surface with padding and shadow.
 */
export default function Card({ children, style, title, actions }) {
  return (
    <section
      style={{
        background: "var(--color-surface)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "var(--shadow-md)",
        ...style,
      }}
      aria-label={title ? `Card: ${title}` : undefined}
    >
      {(title || actions) && (
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16 }}>{title}</h3>
          <div>{actions}</div>
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}
