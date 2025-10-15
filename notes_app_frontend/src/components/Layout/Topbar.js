import React, { useEffect, useState } from "react";

/**
 * Topbar with title, search placeholder, and theme toggle.
 */
export default function Topbar() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <header className="topbar" role="banner">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
        <div
          aria-label="Application title"
          style={{ fontWeight: 800, letterSpacing: 0.2 }}
        >
          Personal Notes
        </div>

        <div style={{ flex: 1 }} />

        <label
          htmlFor="search"
          className="visually-hidden"
        >
          Search notes
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--color-surface)",
            border: "1px solid rgba(0,0,0,0.08)",
            padding: "6px 10px",
            borderRadius: 8,
            boxShadow: "var(--shadow-sm)",
            minWidth: 180,
          }}
          role="search"
        >
          <input
            id="search"
            aria-label="Search notes"
            placeholder="Search notes…"
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              width: 160,
              color: "inherit",
            }}
            onChange={() => {}}
          />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{
            marginLeft: 8,
            background: theme === "light" ? "var(--color-primary)" : "transparent",
            color: theme === "light" ? "#fff" : "var(--color-primary)",
            border: `1px solid var(--color-primary)`,
            padding: "6px 10px",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "var(--shadow-sm)",
            transition: "all .2s ease",
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </header>
  );
}
