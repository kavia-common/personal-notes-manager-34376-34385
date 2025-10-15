//
// Application configuration for API provider selection and base URL.
//
// PUBLIC_INTERFACE
export const API_PROVIDER = process.env.REACT_APP_API_PROVIDER || "mock";

// PUBLIC_INTERFACE
export const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

// Notes:
// - API_PROVIDER is "mock" by default, enabling the localStorage-backed mock service.
// - API_BASE_URL will be used by a future httpNotesService using fetch.
// - Do not import dotenv here; CRA will inject REACT_APP_* env vars at build time.
