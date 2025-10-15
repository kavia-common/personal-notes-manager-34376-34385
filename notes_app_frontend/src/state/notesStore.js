import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

/**
 * Storage helpers
 */
const STORAGE_KEY = "notes_store_v1";

/**
 * Load notes array from localStorage, return array with shape:
 * { id, title, content, createdAt, updatedAt }
 */
function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Ensure basic shape
    return parsed
      .filter(n => n && typeof n.id === "string")
      .map(n => ({
        id: n.id,
        title: n.title || "",
        content: n.content || "",
        createdAt: n.createdAt || new Date().toISOString(),
        updatedAt: n.updatedAt || n.createdAt || new Date().toISOString(),
      }));
  } catch (e) {
    console.warn("Failed to load notes from localStorage", e);
    return [];
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.warn("Failed to save notes to localStorage", e);
  }
}

/**
 * Actions
 */
const ACTIONS = {
  INIT: "INIT",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

/**
 * Reducer
 */
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT: {
      return { ...state, notes: action.payload || [] };
    }
    case ACTIONS.CREATE: {
      const note = action.payload;
      const notes = [note, ...state.notes];
      return { ...state, notes };
    }
    case ACTIONS.UPDATE: {
      const upd = action.payload;
      const notes = state.notes.map(n => (n.id === upd.id ? { ...n, ...upd } : n));
      return { ...state, notes };
    }
    case ACTIONS.DELETE: {
      const id = action.payload;
      const notes = state.notes.filter(n => n.id !== id);
      return { ...state, notes };
    }
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export const NotesContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * NotesProvider wraps app and exposes store with CRUD actions and derived selectors.
 */
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { notes: [] });

  // Initialize from localStorage once
  useEffect(() => {
    const initial = loadNotes();
    dispatch({ type: ACTIONS.INIT, payload: initial });
  }, []);

  // Persist to localStorage whenever notes change
  useEffect(() => {
    saveNotes(state.notes);
  }, [state.notes]);

  // PUBLIC_INTERFACE
  function listNotes({ search } = {}) {
    const q = (search || "").trim().toLowerCase();
    let arr = [...state.notes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    if (q) {
      arr = arr.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    return arr;
  }

  // PUBLIC_INTERFACE
  function getNote(id) {
    return state.notes.find(n => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  function createNote({ title, content }) {
    const now = new Date().toISOString();
    const note = {
      id: cryptoRandomId(),
      title: (title || "").trim(),
      content: (content || "").trim(),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: ACTIONS.CREATE, payload: note });
    return note;
  }

  // PUBLIC_INTERFACE
  function updateNote(id, { title, content }) {
    const existing = getNote(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const updated = {
      ...existing,
      title: typeof title === "string" ? title.trim() : existing.title,
      content: typeof content === "string" ? content.trim() : existing.content,
      updatedAt: now,
    };
    dispatch({ type: ACTIONS.UPDATE, payload: updated });
    return updated;
  }

  // PUBLIC_INTERFACE
  function deleteNote(id) {
    dispatch({ type: ACTIONS.DELETE, payload: id });
  }

  const value = useMemo(
    () => ({
      notes: state.notes,
      listNotes,
      getNote,
      createNote,
      updateNote,
      deleteNote,
    }),
    [state.notes]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * Hook to access notes store.
 */
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}

/**
 * Simple ID generator using crypto or fallback.
 */
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
