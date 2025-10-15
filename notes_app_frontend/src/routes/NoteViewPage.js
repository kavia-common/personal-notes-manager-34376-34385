import React, { useMemo, useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { navigate } from "../router";
import { useNotes } from "../state/notesStore";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Spinner from "../components/common/Spinner";
import { useToast } from "../components/common/Toast";

/**
 * PUBLIC_INTERFACE
 * NoteViewPage shows a single note from the store.
 * Accepts routeProps: { params }
 */
export default function NoteViewPage({ params = {} }) {
  const { id } = params;
  const { getNote, deleteNote, loading } = useNotes();
  const { success, error } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const note = useMemo(() => getNote(id), [id, getNote]);

  const onBack = () => navigate("/");
  const onEdit = () => navigate(`/notes/${id}/edit`);
  const onDelete = () => setConfirmOpen(true);

  const handleConfirm = async () => {
    setConfirmOpen(false);
    const ok = await deleteNote(id);
    if (ok) {
      success("Note deleted");
      navigate("/");
    } else {
      error("Failed to delete note");
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
        {loading && (
          <div style={{ padding: "12px 0" }}>
            <Spinner label="Loading…" />
          </div>
        )}
        {!loading && !note ? (
          <div className="small-muted">This note does not exist.</div>
        ) : !loading ? (
          <article>
            <div className="small-muted" style={{ marginBottom: 8 }}>
              Created {formatDateTime(note.createdAt)} · Updated {formatDateTime(note.updatedAt)}
            </div>
            <div style={{ whiteSpace: "pre-wrap" }}>{note.content}</div>
          </article>
        ) : null}
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this note?"
        message="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
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
