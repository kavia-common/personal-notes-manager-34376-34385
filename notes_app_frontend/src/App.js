import React, { useEffect, useState } from "react";
import "./App.css";
import "./theme.css";
import Sidebar from "./components/Layout/Sidebar";
import Topbar from "./components/Layout/Topbar";
import NotesListPage from "./routes/NotesListPage";
import NoteEditorPage from "./routes/NoteEditorPage";
import NoteViewPage from "./routes/NoteViewPage";
import NotFoundPage from "./routes/NotFoundPage";
import { createRouter, getCurrentPath, subscribe } from "./router";

/**
 * PUBLIC_INTERFACE
 * App shell that composes the minimal router with Ocean theme layout.
 */
export default function App() {
  // Initialize theme from localStorage for initial paint consistency.
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Router wiring
  const [path, setPath] = useState(getCurrentPath());
  useEffect(() => {
    const unsub = subscribe(setPath);
    return unsub;
  }, []);

  const routes = [
    { path: "/", component: NotesListPage },
    { path: "/notes/new", component: (props) => <NoteEditorPage {...props} /> },
    { path: "/notes/:id", component: (props) => <NoteViewPage {...props} /> },
    { path: "/notes/:id/edit", component: (props) => <NoteEditorPage {...props} /> },
  ];
  const router = createRouter(routes, NotFoundPage);
  const resolved = router.resolve(path);
  const Active = resolved.component;

  return (
    <div className="app-shell" role="application">
      <Sidebar />
      <Topbar />
      <main className="content" id="main">
        <Active params={resolved.params} path={resolved.path} />
      </main>
    </div>
  );
}
