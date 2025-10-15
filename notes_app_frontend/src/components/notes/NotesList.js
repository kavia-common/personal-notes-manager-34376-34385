import React, { useMemo, useState } from "react";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";
import NoteItem from "./NoteItem";
import { navigate } from "../../router";
import { useNotes } from "../../state/notesStore";

/**
 * PUBLIC_INTERFACE
 * NotesList renders list of notes with a client-side search filter.
 */
export default function NotesList() {
  const { listNotes } = useNotes();
  const [query, setQuery] = useState("");

  const results = useMemo(() => listNotes({ search: query }), [listNotes, query]);

  const onNew = () => navigate("/notes/new");

  if (!results.length) {
    return (
      <EmptyState
        title="No notes yet"
        subtitle="Create your first note to get started."
        action={<Button variant="secondary" onClick={onNew}>Create Note</Button>}
      />
    );
    }

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <label className="visually-hidden" htmlFor="note-search">Search notes</label>
        <input
          id="note-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes…"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)",
            background: "var(--color-surface)",
          }}
        />
        <Button variant="primary" onClick={onNew}>New</Button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {results.map(n => (
          <li key={n.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <NoteItem note={n} />
          </li>
        ))}
      </ul>
    </div>
  );
}
