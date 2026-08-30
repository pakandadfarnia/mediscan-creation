// Persisted flag controlling whether the app skips the Welcome screen on
// future loads. The auth token itself persists regardless; this only decides
// whether signed-in users land on Welcome or go straight into the app.

const KEY = "mediscan_remember";

export function getRemember() {
  try {
    return localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function setRemember(value) {
  try {
    localStorage.setItem(KEY, value ? "true" : "false");
  } catch {
    /* ignore */
  }
}