import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import * as api from "../services/api";

/**
 * Actions
 */
const ACTIONS = {
  INIT: "INIT",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

/**
 * Reducer
 */
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT: {
      return { ...state, notes: action.payload || [], loading: false, error: null };
    }
    case ACTIONS.CREATE: {
      const note = action.payload;
      const notes = [note, ...state.notes];
      return { ...state, notes, loading: false };
    }
    case ACTIONS.UPDATE: {
      const upd = action.payload;
      const notes = state.notes.map((n) => (n.id === upd.id ? { ...n, ...upd } : n));
      return { ...state, notes, loading: false };
    }
    case ACTIONS.DELETE: {
      const id = action.payload;
      const notes = state.notes.filter((n) => n.id !== id);
      return { ...state, notes, loading: false };
    }
    case ACTIONS.SET_LOADING: {
      return { ...state, loading: action.payload };
    }
    case ACTIONS.SET_ERROR: {
      return { ...state, error: action.payload, loading: false };
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
 * Uses an API layer (mock by default) with Promise-based operations.
 */
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { notes: [], loading: true, error: null });
  const mountedRef = useRef(true);
  const [lastAction, setLastAction] = useState(null); // for debugging/telemetry if needed

  useEffect(() => {
    mountedRef.current = true;
    // Initialize from API once (async)
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    api
      .listNotes()
      .then((list) => {
        if (mountedRef.current) {
          dispatch({ type: ACTIONS.INIT, payload: list });
        }
      })
      .catch((e) => {
        console.warn("NotesProvider: failed to initialize notes", e);
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to load notes" });
        dispatch({ type: ACTIONS.INIT, payload: [] });
      });
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // PUBLIC_INTERFACE
  function listNotes({ search } = {}) {
    // Selector over in-memory state for immediate UI updates
    const q = (search || "").trim().toLowerCase();
    let arr = [...state.notes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    if (q) {
      arr = arr.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    return arr;
  }

  // PUBLIC_INTERFACE
  function getNote(id) {
    return state.notes.find((n) => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  function createNote({ title, content }) {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    setLastAction("create");
    const p = api
      .createNote({ title, content })
      .then((created) => {
        dispatch({ type: ACTIONS.CREATE, payload: created });
        return created;
      })
      .catch((e) => {
        console.warn("createNote failed", e);
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to create note" });
        throw e;
      });

    // Optimistic placeholder
    const tempNow = new Date().toISOString();
    const temp = {
      id: "temp_" + Math.random().toString(36).slice(2),
      title: (title || "").trim(),
      content: (content || "").trim(),
      createdAt: tempNow,
      updatedAt: tempNow,
    };
    dispatch({ type: ACTIONS.CREATE, payload: temp });
    p.then((created) => {
      if (created && created.id !== temp.id) {
        dispatch({ type: ACTIONS.DELETE, payload: temp.id });
        dispatch({ type: ACTIONS.CREATE, payload: created });
      }
    }).catch(() => {
      dispatch({ type: ACTIONS.DELETE, payload: temp.id });
    });

    return p;
  }

  // PUBLIC_INTERFACE
  function updateNote(id, { title, content }) {
    const current = getNote(id);
    if (!current) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Note not found" });
      return Promise.resolve(null);
    }
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    setLastAction("update");

    const optimistic = {
      ...current,
      title: typeof title === "string" ? title.trim() : current.title,
      content: typeof content === "string" ? content.trim() : current.content,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: ACTIONS.UPDATE, payload: optimistic });

    return api
      .updateNote(id, { title, content })
      .then((server) => {
        if (!server) {
          dispatch({ type: ACTIONS.UPDATE, payload: current });
          dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to update note" });
          return null;
        } else {
          dispatch({ type: ACTIONS.UPDATE, payload: server });
          return server;
        }
      })
      .catch(() => {
        dispatch({ type: ACTIONS.UPDATE, payload: current });
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to update note" });
        return null;
      });
  }

  // PUBLIC_INTERFACE
  function deleteNote(id) {
    const existing = getNote(id);
    if (!existing) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Note not found" });
      return Promise.resolve(false);
    }
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    setLastAction("delete");

    // Optimistic remove
    dispatch({ type: ACTIONS.DELETE, payload: id });
    return api.deleteNote(id).then(
      () => true,
      () => {
        // Rollback on error
        dispatch({ type: ACTIONS.CREATE, payload: existing });
        dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to delete note" });
        return false;
      }
    );
  }

  const value = useMemo(
    () => ({
      notes: state.notes,
      loading: !!state.loading,
      error: state.error,
      lastAction,
      listNotes,
      getNote,
      createNote,
      updateNote,
      deleteNote,
    }),
    [state.notes, state.loading, state.error, lastAction]
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
