import React, { useState } from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { navigate } from "../router";

/**
 * PUBLIC_INTERFACE
 * NoteEditorPage handles creating and editing notes (mock form).
 * Accepts routeProps: { params }
 */
export default function NoteEditorPage({ params = {} }) {
  const isEdit = Boolean(params.id);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const onCancel = () => {
    if (isEdit) navigate(`/notes/${params.id}`);
    else navigate("/");
  };

  const onSave = () => {
    // Placeholder save; integrate with API later
    alert("Saved (mock). Returning to list.");
    navigate("/");
  };

  return (
    <div className="container">
      <Card
        title={isEdit ? "Edit Note" : "New Note"}
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button variant="primary" onClick={onSave}>{isEdit ? "Update" : "Save"}</Button>
          </div>
        }
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label htmlFor="title" style={{ display: "block", marginBottom: 6 }}>
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "var(--color-surface)",
              }}
            />
          </div>

          <div>
            <label htmlFor="body" style={{ display: "block", marginBottom: 6 }}>
              Content
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your note…"
              rows={10}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.15)",
                background: "var(--color-surface)",
                resize: "vertical",
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
