import React, { useMemo, useState } from "react";
import Card from "../components/common/Card";
import NoteForm from "../components/notes/NoteForm";
import { navigate } from "../router";
import { useNotes } from "../state/notesStore";
import Spinner from "../components/common/Spinner";
import { useToast } from "../components/common/Toast";

/**
 * PUBLIC_INTERFACE
 * NoteEditorPage handles creating and editing notes using the notesStore.
 * Accepts routeProps: { params }
 */
export default function NoteEditorPage({ params = {} }) {
  const isEdit = Boolean(params.id);
  const { getNote, createNote, updateNote, loading } = useNotes();
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const existing = useMemo(() => (isEdit ? getNote(params.id) : null), [isEdit, params.id, getNote]);

  const onCancel = () => {
    if (isEdit && existing) navigate(`/notes/${params.id}`);
    else navigate("/");
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (isEdit) {
        const res = await updateNote(params.id, payload);
        if (res) {
          success("Note updated");
          navigate(`/notes/${params.id}`);
        } else {
          error("Failed to update note");
        }
      } else {
        const created = await createNote(payload);
        success("Note created");
        navigate(`/notes/${created.id}`);
      }
    } catch {
      error(isEdit ? "Failed to update note" : "Failed to create note");
    } finally {
      setSubmitting(false);
    }
  };

  const headerTitle = isEdit ? (existing ? "Edit Note" : "Note Not Found") : "New Note";

  return (
    <div className="container">
      <Card title={headerTitle}>
        {(loading || submitting) && (
          <div style={{ paddingBottom: 12 }}>
            <Spinner label={submitting ? "Saving…" : "Loading…"} />
          </div>
        )}
        {isEdit && !existing && !loading ? (
          <div className="small-muted">This note does not exist.</div>
        ) : (
          !loading && (
            <NoteForm
              initial={existing ? { title: existing.title, content: existing.content } : { title: "", content: "" }}
              onCancel={onCancel}
              onSubmit={handleSubmit}
              submitLabel={isEdit ? "Update" : "Save"}
            />
          )
        )}
      </Card>
    </div>
  );
}
