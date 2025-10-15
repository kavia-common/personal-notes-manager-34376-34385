const subscribers = new Set();

/**
 * Parse a path pattern like /notes/:id/edit into tokens and param names.
 */
function compilePattern(pattern) {
  const segments = pattern.split("/").filter(Boolean);
  const matchers = segments.map(seg => {
    if (seg.startsWith(":")) {
      return { type: "param", name: seg.slice(1) };
    }
    return { type: "static", value: seg };
  });
  return matchers;
}

/**
 * Attempt to match a pathname to a pattern. Returns { params } or null.
 */
function matchPath(pattern, pathname) {
  const matchers = compilePattern(pattern);
  const pathSegments = pathname.split("/").filter(Boolean);
  if (matchers.length !== pathSegments.length) return null;
  const params = {};
  for (let i = 0; i < matchers.length; i++) {
    const m = matchers[i];
    const seg = pathSegments[i];
    if (m.type === "static") {
      if (m.value !== seg) return null;
    } else if (m.type === "param") {
      params[m.name] = decodeURIComponent(seg);
    }
  }
  return { params };
}

/**
/* PUBLIC_INTERFACE */
export function navigate(path) {
  /** Push a new history state and notify listeners. */
  if (window.location.pathname !== path) {
    window.history.pushState({}, "", path);
    notify();
  }
}

/* PUBLIC_INTERFACE */
export function getCurrentPath() {
  /** Returns the current location pathname. */
  return window.location.pathname || "/";
}

function notify() {
  for (const cb of subscribers) cb(getCurrentPath());
}

/* PUBLIC_INTERFACE */
export function subscribe(callback) {
  /** Subscribe to path changes; returns an unsubscribe function. */
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

/* PUBLIC_INTERFACE */
export function createRouter(routes, notFoundComponent) {
  /**
   * Returns a function that resolves the current route to a component
   * with computed route props: { params, path }.
   */
  const table = routes.map(r => ({ ...r, pattern: r.path }));
  function resolve(pathname) {
    for (const r of table) {
      const res = matchPath(r.pattern, pathname);
      if (res) {
        return { component: r.component, params: res.params, path: pathname };
      }
    }
    return { component: notFoundComponent, params: {}, path: pathname };
  }
  return { resolve };
}

/* Setup popstate listener once */
let popstateBound = false;
function ensurePopstateListener() {
  if (popstateBound) return;
  window.addEventListener("popstate", () => notify());
  popstateBound = true;
}
ensurePopstateListener();
