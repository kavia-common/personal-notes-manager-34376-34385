import React from "react";
import { navigate, getCurrentPath } from "../../router";

/**
 * Sidebar navigation for Ocean Professional theme.
 */
export default function Sidebar() {
  const path = getCurrentPath();

  const linkBase = "display:block;padding:10px 12px;border-radius:8px;margin:4px 0;font-weight:600;";
  const inactive =
    "color: var(--color-text); background: transparent; border: 1px solid rgba(0,0,0,0.05);";
  const active =
    "color: #0b4ae2; background: rgba(37,99,235,0.10); border: 1px solid rgba(37,99,235,0.25);";

  const go = (to) => (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <aside className="sidebar" aria-label="Primary">
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>
          Notes
        </div>

        <nav>
          <a
            href="/"
            onClick={go("/")}
            style={{ cssText: undefined }}
            className="nav-link"
            aria-current={path === "/" ? "page" : undefined}
          >
            <span
              style={{
                ...(path === "/"
                  ? {}
                  : {}),
              }}
            />
          </a>
          <div>
            <a
              href="/"
              onClick={go("/")}
              style={{ display: "block", padding: "10px 12px", borderRadius: 8, margin: "4px 0",
                fontWeight: 600,
                color: path === "/" ? "#0b4ae2" : "var(--color-text)",
                background: path === "/" ? "rgba(37,99,235,0.10)" : "transparent",
                border: path === "/" ? "1px solid rgba(37,99,235,0.25)" : "1px solid rgba(0,0,0,0.05)"
              }}
            >
              All Notes
            </a>
            <a
              href="/notes/new"
              onClick={go("/notes/new")}
              style={{ display: "block", padding: "10px 12px", borderRadius: 8, margin: "4px 0",
                fontWeight: 600,
                color: path.startsWith("/notes/new") ? "#0b4ae2" : "var(--color-text)",
                background: path.startsWith("/notes/new") ? "rgba(37,99,235,0.10)" : "transparent",
                border: path.startsWith("/notes/new") ? "1px solid rgba(37,99,235,0.25)" : "1px solid rgba(0,0,0,0.05)"
              }}
            >
              New Note
            </a>
          </div>
        </nav>

        <div style={{ marginTop: 18, fontSize: 12 }} className="small-muted">
          Ocean Professional
        </div>
      </div>
    </aside>
  );
}
