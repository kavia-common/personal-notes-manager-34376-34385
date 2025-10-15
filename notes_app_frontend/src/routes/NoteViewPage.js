import React from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { navigate } from "../router";

/**
 * PUBLIC_INTERFACE
 * NoteViewPage shows a single note (mock).
 * Accepts routeProps: { params }
 */
export default function NoteViewPage({ params = {} }) {
  const { id } = params;
  const onBack = () => navigate("/");
  const onEdit = () => navigate(`/notes/${id}/edit`);

  return (
    <div className="container">
      <Card
        title={`Note #${id}`}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" onClick={onBack}>Back</Button>
            <Button variant="primary" onClick={onEdit}>Edit</Button>
          </div>
        }
      >
        <div style={{ color: "var(--color-text)" }}>
          <p className="small-muted">This is a placeholder view for note {id}.</p>
          <p>
            Content will be displayed here once the data layer is connected. Use the
            Edit button to navigate to editor page.
          </p>
        </div>
      </Card>
    </div>
  );
}
