// Module-level store for the in-progress scan session. Because navigating
// between tabs is a client-side route (no page reload), this object survives
// Scan page unmount/remount — so captured photos and extracted details are
// still there when the user comes back to the Scan tab.

const store = {
  phase: "capture",
  photos: [],
  extracted: null,
  extractedImage: "",
  meds: [],
};

export function getScanSession() {
  return store;
}

export function updateScanSession(patch) {
  Object.assign(store, patch);
}

export function clearScanSession() {
  store.photos.forEach((p) => {
    try { URL.revokeObjectURL(p.preview); } catch { /* already revoked */ }
  });
  store.phase = "capture";
  store.photos = [];
  store.extracted = null;
  store.extractedImage = "";
  store.meds = [];
}