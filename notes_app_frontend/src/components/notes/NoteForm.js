import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Textarea from "../common/Textarea";

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
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          aria-invalid={!!errors.title}
        />
        {errors.title && <div className="small-muted" style={{ color: "var(--color-error)" }}>{errors.title}</div>}
      </div>

      <div>
        <label htmlFor="content" style={{ display: "block", marginBottom: 6 }}>
          Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note…"
          rows={10}
          aria-invalid={!!errors.content}
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
