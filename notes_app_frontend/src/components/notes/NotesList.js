import React, { useMemo, useState } from "react";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";
import NoteItem from "./NoteItem";
import { navigate } from "../../router";
import { useNotes } from "../../state/notesStore";
import Input from "../common/Input";
import Spinner from "../common/Spinner";

/**
 * PUBLIC_INTERFACE
 * NotesList renders list of notes with a client-side search filter.
 */
export default function NotesList() {
  const { listNotes, loading } = useNotes();
  const [query, setQuery] = useState("");

  const results = useMemo(() => listNotes({ search: query }), [listNotes, query]);

  const onNew = () => navigate("/notes/new");

  return (
    <div>
      <div style={{ marginBottom: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <label className="visually-hidden" htmlFor="note-search">Search notes</label>
        <Input
          id="note-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes…"
          aria-label="Search notes"
        />
        <Button variant="primary" onClick={onNew}>New</Button>
      </div>

      {loading && (
        <div style={{ padding: "16px 0" }}>
          <Spinner label="Loading notes…" />
        </div>
      )}

      {!loading && results.length === 0 && query.trim().length > 0 && (
        <EmptyState
          title="No results"
          subtitle="Try adjusting your search terms."
          action={<Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>}
        />
      )}

      {!loading && results.length === 0 && query.trim().length === 0 && (
        <EmptyState
          title="No notes yet"
          subtitle="Create your first note to get started."
          action={<Button variant="secondary" onClick={onNew}>Create Note</Button>}
        />
      )}

      {!loading && results.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {results.map(n => (
            <li key={n.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <NoteItem note={n} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
