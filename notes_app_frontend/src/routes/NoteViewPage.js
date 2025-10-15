import React from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { navigate } from "../router";
import { useNotes } from "../state/notesStore";

/**
 * PUBLIC_INTERFACE
 * NoteViewPage shows a single note from the store.
 * Accepts routeProps: { params }
 */
export default function NoteViewPage({ params = {} }) {
  const { id } = params;
  const { getNote, deleteNote } = useNotes();
  const note = getNote(id);

  const onBack = () => navigate("/");
  const onEdit = () => navigate(`/notes/${id}/edit`);
  const onDelete = () => {
    const ok = window.confirm("Delete this note?");
    if (ok) {
      deleteNote(id);
      navigate("/");
    }
  };

  return (
    <div className="container">
      <Card
        title={note ? (note.title || "(Untitled)") : "Note not found"}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" onClick={onBack}>Back</Button>
            {note && <Button variant="primary" onClick={onEdit}>Edit</Button>}
            {note && <Button variant="danger" onClick={onDelete}>Delete</Button>}
          </div>
        }
      >
        {!note ? (
          <div className="small-muted">This note does not exist.</div>
        ) : (
          <article>
            <div className="small-muted" style={{ marginBottom: 8 }}>
              Created {formatDateTime(note.createdAt)} · Updated {formatDateTime(note.updatedAt)}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{note.content}</div>
          </article>
        )}
      </Card>
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
