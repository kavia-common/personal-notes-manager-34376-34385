//
// API layer selector. Chooses the active provider and re-exports uniform CRUD.
// Default provider is "mock". Future "http" provider can be added using fetch.
//

import { API_PROVIDER } from "../../config";
import * as mock from "./mockNotesService";

// Map of providers
const providers = {
  mock,
  // http: await import('./httpNotesService') // Placeholder for future
};

const chosen = providers[API_PROVIDER] || providers.mock;

// PUBLIC_INTERFACE
export const listNotes = chosen.listNotes;

// PUBLIC_INTERFACE
export const getNote = chosen.getNote;

// PUBLIC_INTERFACE
export const createNote = chosen.createNote;

// PUBLIC_INTERFACE
export const updateNote = chosen.updateNote;

// PUBLIC_INTERFACE
export const deleteNote = chosen.deleteNote;
