//
// Mock Notes Service
// Promise-based CRUD operations backed by localStorage with simulated latency.
//

const STORAGE_KEY = "notes_store_v1";
const DEFAULT_LATENCY_MS = 120;

// PUBLIC_INTERFACE
export async function listNotes({ search } = {}, { latencyMs = DEFAULT_LATENCY_MS } = {}) {
  await delay(latencyMs);
  const notes = loadNotes();
  const q = (search || "").trim().toLowerCase();
  let arr = [...notes].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  if (q) {
    arr = arr.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }
  return arr;
}

// PUBLIC_INTERFACE
export async function getNote(id, { latencyMs = DEFAULT_LATENCY_MS } = {}) {
  await delay(latencyMs);
  const notes = loadNotes();
  return notes.find((n) => n.id === id) || null;
}

// PUBLIC_INTERFACE
export async function createNote({ title, content }, { latencyMs = DEFAULT_LATENCY_MS } = {}) {
  await delay(latencyMs);
  const now = new Date().toISOString();
  const note = {
    id: cryptoRandomId(),
    title: (title || "").trim(),
    content: (content || "").trim(),
    createdAt: now,
    updatedAt: now,
  };
  const notes = loadNotes();
  const next = [note, ...notes];
  saveNotes(next);
  return note;
}

// PUBLIC_INTERFACE
export async function updateNote(id, { title, content }, { latencyMs = DEFAULT_LATENCY_MS } = {}) {
  await delay(latencyMs);
  const notes = loadNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  const existing = notes[idx];
  const updated = {
    ...existing,
    title: typeof title === "string" ? title.trim() : existing.title,
    content: typeof content === "string" ? content.trim() : existing.content,
    updatedAt: new Date().toISOString(),
  };
  const next = [...notes];
  next[idx] = updated;
  saveNotes(next);
  return updated;
}

// PUBLIC_INTERFACE
export async function deleteNote(id, { latencyMs = DEFAULT_LATENCY_MS } = {}) {
  await delay(latencyMs);
  const notes = loadNotes();
  const next = notes.filter((n) => n.id !== id);
  saveNotes(next);
  return { id };
}

// Helpers
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((n) => n && typeof n.id === "string")
      .map((n) => ({
        id: n.id,
        title: n.title || "",
        content: n.content || "",
        createdAt: n.createdAt || new Date().toISOString(),
        updatedAt: n.updatedAt || n.createdAt || new Date().toISOString(),
      }));
  } catch (e) {
    console.warn("mockNotesService: Failed to load notes", e);
    return [];
  }
}

function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.warn("mockNotesService: Failed to save notes", e);
  }
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "id_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
