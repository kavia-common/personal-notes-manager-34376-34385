import React from "react";
import Button from "../common/Button";
import { navigate } from "../../router";
import { useNotes } from "../../state/notesStore";

/**
 * PUBLIC_INTERFACE
 * NoteItem renders a single note row with actions.
 */
export default function NoteItem({ note }) {
  const { deleteNote } = useNotes();
  const snippet =
    note.content.length > 140 ? note.content.slice(0, 140) + "…" : note.content;

  const onView = () => navigate(`/notes/${note.id}`);
  const onEdit = () => navigate(`/notes/${note.id}/edit`);
  const onDelete = () => {
    const ok = window.confirm("Delete this note?");
    if (ok) deleteNote(note.id);
  };

  return (
    <div style={{ padding: "12px 4px", display: "grid", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontWeight: 800, cursor: "pointer" }} onClick={onView}>
          {note.title || "(Untitled)"}
        </div>
        <div className="small-muted" style={{ whiteSpace: "nowrap" }}>
          Updated {formatDateTime(note.updatedAt)}
        </div>
      </div>
      <div className="small-muted">{snippet || "No content"}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="secondary" onClick={onView}>View</Button>
        <Button variant="primary" onClick={onEdit}>Edit</Button>
        <Button variant="danger" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}

function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
