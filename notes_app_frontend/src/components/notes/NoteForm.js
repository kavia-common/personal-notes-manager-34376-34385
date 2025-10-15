import React, { useEffect, useState } from "react";
import Button from "../common/Button";

/**
 * PUBLIC_INTERFACE
 * NoteForm supports creating and editing notes with basic validation.
 * Props:
 * - initial: { title, content }
 * - onCancel(), onSubmit({ title, content })
 * - submitLabel
 */
export default function NoteForm({ initial, onCancel, onSubmit, submitLabel = "Save" }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!content.trim()) e.content = "Content is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), content: content.trim() });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
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
        {errors.title && <div className="small-muted" style={{ color: "var(--color-error)" }}>{errors.title}</div>}
      </div>

      <div>
        <label htmlFor="content" style={{ display: "block", marginBottom: 6 }}>
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
        {errors.content && <div className="small-muted" style={{ color: "var(--color-error)" }}>{errors.content}</div>}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
