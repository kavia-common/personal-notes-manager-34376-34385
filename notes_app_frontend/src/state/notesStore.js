import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import * as api from "../services/api";

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
      const notes = state.notes.map((n) => (n.id === upd.id ? { ...n, ...upd } : n));
      return { ...state, notes };
    }
    case ACTIONS.DELETE: {
      const id = action.payload;
      const notes = state.notes.filter((n) => n.id !== id);
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
 * Uses an API layer (mock by default) with Promise-based operations.
 */
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { notes: [] });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    // Initialize from API once (async)
    api
      .listNotes()
      .then((list) => {
        if (mountedRef.current) {
          dispatch({ type: ACTIONS.INIT, payload: list });
        }
      })
      .catch((e) => {
        console.warn("NotesProvider: failed to initialize notes", e);
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
    // Optimistic approach: rely on API to generate canonical note with IDs/timestamps
    // but return a promise result synchronously to match current calling style.
    const p = api
      .createNote({ title, content })
      .then((created) => {
        dispatch({ type: ACTIONS.CREATE, payload: created });
        return created;
      })
      .catch((e) => {
        console.warn("createNote failed", e);
        throw e;
      });

    // For backward compatibility with existing sync usage, return a placeholder
    // that will be quickly reconciled when promise resolves.
    // However, routes currently use the return value immediately.
    // To preserve behavior, we temporarily create a local placeholder and dispatch,
    // then reconcile when API returns. Mock service returns quickly with same data format.
    const tempNow = new Date().toISOString();
    const temp = {
      id: "temp_" + Math.random().toString(36).slice(2),
      title: (title || "").trim(),
      content: (content || "").trim(),
      createdAt: tempNow,
      updatedAt: tempNow,
    };
    // Dispatch optimistic item to keep UI snappy
    dispatch({ type: ACTIONS.CREATE, payload: temp });
    // Reconcile on resolve: replace temp by actual created
    p.then((created) => {
      if (created && created.id !== temp.id) {
        dispatch({ type: ACTIONS.DELETE, payload: temp.id });
        dispatch({ type: ACTIONS.CREATE, payload: created });
      }
    }).catch(() => {
      // rollback optimistic insert
      dispatch({ type: ACTIONS.DELETE, payload: temp.id });
    });

    return temp;
  }

  // PUBLIC_INTERFACE
  function updateNote(id, { title, content }) {
    const current = getNote(id);
    if (!current) return null;

    const optimistic = {
      ...current,
      title: typeof title === "string" ? title.trim() : current.title,
      content: typeof content === "string" ? content.trim() : current.content,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: ACTIONS.UPDATE, payload: optimistic });

    api
      .updateNote(id, { title, content })
      .then((server) => {
        if (!server) {
          // If server reports not found, rollback to previous
          dispatch({ type: ACTIONS.UPDATE, payload: current });
        } else {
          dispatch({ type: ACTIONS.UPDATE, payload: server });
        }
      })
      .catch(() => {
        // Rollback on error
        dispatch({ type: ACTIONS.UPDATE, payload: current });
      });

    return optimistic;
  }

  // PUBLIC_INTERFACE
  function deleteNote(id) {
    const existing = getNote(id);
    if (!existing) return;
    // Optimistic remove
    dispatch({ type: ACTIONS.DELETE, payload: id });
    api.deleteNote(id).catch(() => {
      // Rollback on error
      dispatch({ type: ACTIONS.CREATE, payload: existing });
    });
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
