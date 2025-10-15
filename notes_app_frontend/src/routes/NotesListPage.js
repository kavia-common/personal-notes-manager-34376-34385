import React, { useEffect } from "react";
import Card from "../components/common/Card";
import NotesList from "../components/notes/NotesList";
import { useNotes } from "../state/notesStore";
import { useToast } from "../components/common/Toast";

/**
 * PUBLIC_INTERFACE
 * NotesListPage shows notes from the store.
 */
export default function NotesListPage() {
  const { error } = useNotes();
  const { error: showError } = useToast();

  useEffect(() => {
    if (error) showError(error);
  }, [error, showError]);

  return (
    <div className="container">
      <Card title="All Notes">
        <NotesList />
      </Card>
    </div>
  );
}
