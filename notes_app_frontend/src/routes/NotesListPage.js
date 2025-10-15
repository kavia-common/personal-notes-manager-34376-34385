import React from "react";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import { navigate } from "../router";

/**
 * PUBLIC_INTERFACE
 * NotesListPage shows a list of notes (placeholder for now).
 */
export default function NotesListPage() {
  const goNew = () => navigate("/notes/new");

  const dummyNotes = []; // placeholder; to be connected to API later

  return (
    <div className="container">
      <Card
        title="All Notes"
        actions={<Button variant="primary" onClick={goNew}>New Note</Button>}
      >
        {dummyNotes.length === 0 ? (
          <EmptyState
            title="No notes yet"
            subtitle="Create your first note to get started."
            action={<Button variant="secondary" onClick={goNew}>Create Note</Button>}
          />
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {dummyNotes.map((n) => (
              <li key={n.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {n.title}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
