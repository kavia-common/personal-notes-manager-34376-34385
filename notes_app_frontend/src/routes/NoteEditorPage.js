import React, { useMemo } from "react";
import Card from "../components/common/Card";
import NoteForm from "../components/notes/NoteForm";
import { navigate } from "../router";
import { useNotes } from "../state/notesStore";

/**
 * PUBLIC_INTERFACE
 * NoteEditorPage handles creating and editing notes using the notesStore.
 * Accepts routeProps: { params }
 */
export default function NoteEditorPage({ params = {} }) {
  const isEdit = Boolean(params.id);
  const { getNote, createNote, updateNote } = useNotes();
  const existing = useMemo(() => (isEdit ? getNote(params.id) : null), [isEdit, params.id, getNote]);

  const onCancel = () => {
    if (isEdit && existing) navigate(`/notes/${params.id}`);
    else navigate("/");
  };

  const handleSubmit = (payload) => {
    if (isEdit) {
      const res = updateNote(params.id, payload);
      if (res) navigate(`/notes/${params.id}`);
    } else {
      const created = createNote(payload);
      navigate(`/notes/${created.id}`);
    }
  };

  const headerTitle = isEdit ? (existing ? "Edit Note" : "Note Not Found") : "New Note";

  return (
    <div className="container">
      <Card title={headerTitle}>
        {isEdit && !existing ? (
          <div className="small-muted">This note does not exist.</div>
        ) : (
          <NoteForm
            initial={existing ? { title: existing.title, content: existing.content } : { title: "", content: "" }}
            onCancel={onCancel}
            onSubmit={handleSubmit}
            submitLabel={isEdit ? "Update" : "Save"}
          />
        )}
      </Card>
    </div>
  );
}
