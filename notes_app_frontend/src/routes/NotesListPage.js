import React from "react";
import Card from "../components/common/Card";
import NotesList from "../components/notes/NotesList";

/**
 * PUBLIC_INTERFACE
 * NotesListPage shows notes from the store.
 */
export default function NotesListPage() {
  return (
    <div className="container">
      <Card title="All Notes">
        <NotesList />
      </Card>
    </div>
  );
}
