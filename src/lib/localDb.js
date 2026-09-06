// Offline-first local database backed by IndexedDB.
// Mirrors the subset of the Base44 entity SDK the app uses, so medication,
// allergy and profile data lives entirely on the device — no internet
// required to read or write it after the first visit.

const DB_NAME = "medilens";
const DB_VERSION = 2;
const STORES = ["Medication", "Allergy", "Profile", "Member", "Alarm"];

// Cached open-DB promise so we only open the database once per session.
let dbPromise = null;

// Open (or create) the IndexedDB database with one object store per entity.
function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    // First run (or version bump): create the object stores keyed by `id`.
    req.onupgradeneeded = () => {
      const db = req.result;
      STORES.forEach((s) => {
        if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: "id" });
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

// Wrap an IndexedDB request in a promise so we can await it.
function reqToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Basic CRUD primitives over a single object store.
async function getAll(store) {
  const db = await openDB();
  return reqToPromise(db.transaction(store, "readonly").objectStore(store).getAll());
}
async function getOne(store, id) {
  const db = await openDB();
  return reqToPromise(db.transaction(store, "readonly").objectStore(store).get(id));
}
async function put(store, val) {
  const db = await openDB();
  return reqToPromise(db.transaction(store, "readwrite").objectStore(store).put(val));
}
async function del(store, id) {
  const db = await openDB();
  return reqToPromise(db.transaction(store, "readwrite").objectStore(store).delete(id));
}

// Generate a unique id for locally-created records.
function uid() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

// Sort items by a key; a leading "-" means descending (mirrors the SDK's sort
// argument, e.g. "-created_date").
function sortBy(items, sort) {
  if (!sort) return items;
  const desc = sort.startsWith("-");
  const key = desc ? sort.slice(1) : sort;
  return [...items].sort((a, b) => {
    const av = String((a && a[key]) || "");
    const bv = String((b && b[key]) || "");
    return desc ? bv.localeCompare(av) : av.localeCompare(bv);
  });
}

// Build an entity API that mimics the Base44 SDK (list, filter, get, create,
// update, delete, ...) over a single IndexedDB object store.
function makeEntity(store) {
  return {
    // Return all records, optionally sorted and limited.
    async list(sort, limit) {
      let items = (await getAll(store)) || [];
      items = sortBy(items, sort);
      if (limit) items = items.slice(0, limit);
      return items;
    },
    // Return records matching a simple equality query, optionally sorted/limited.
    async filter(query, sort, limit) {
      let items = (await getAll(store)) || [];
      if (query) {
        items = items.filter((it) =>
          Object.entries(query).every(([k, v]) => it && it[k] === v)
        );
      }
      items = sortBy(items, sort);
      if (limit) items = items.slice(0, limit);
      return items;
    },
    // Fetch a single record by id (or null if missing).
    async get(id) {
      const rec = await getOne(store, id);
      return rec || null;
    },
    // Create a record, stamping the built-in fields the SDK normally adds.
    async create(data) {
      const now = new Date().toISOString();
      const rec = { id: uid(), created_date: now, updated_date: now, created_by_id: "local", ...data };
      await put(store, rec);
      return rec;
    },
    // Create several records sequentially (so each gets its own id/timestamps).
    async bulkCreate(arr) {
      const out = [];
      for (const d of arr) out.push(await this.create(d));
      return out;
    },
    // Merge new data into an existing record and persist it.
    async update(id, data) {
      const existing = await getOne(store, id);
      if (!existing) return null;
      const rec = { ...existing, ...data, updated_date: new Date().toISOString() };
      await put(store, rec);
      return rec;
    },
    // Delete a single record by id.
    async delete(id) {
      return del(store, id);
    },
    // Delete all records matching a simple equality query.
    async deleteMany(query) {
      const items = await this.filter(query);
      for (const it of items) await del(store, it.id);
      return items.length;
    },
  };
}

// One entity API per object store, used throughout the app.
export const Medication = makeEntity("Medication");
export const Allergy = makeEntity("Allergy");
export const Profile = makeEntity("Profile");
// Household profiles (e.g. you, your kids, an elderly parent). Medications,
// allergies and alarms are each scoped to one profile via `profile_id`.
export const Member = makeEntity("Member");
// Medication reminder alarms: one record per reminder time, per medication.
export const Alarm = makeEntity("Alarm");

// Strip the built-in fields before importing a cloud record, so the local
// create() can re-stamp its own id/timestamps.
function stripBuiltins(rec) {
  if (!rec) return rec;
  const { id, created_date, updated_date, created_by_id, ...rest } = rec;
  return rest;
}

// One-time import of any existing cloud data into the local DB, so users
// don't lose what they saved before the app went offline-first. Runs once
// (flagged in localStorage) and only when online.
export async function ensureImported() {
  if (localStorage.getItem("medilens_imported_v1") === "1") return;
  if (!navigator.onLine) return;
  try {
    const { base44 } = await import("@/api/base44Client");
    // Pull the three entity collections from the cloud in parallel.
    const [meds, allergies, profiles] = await Promise.all([
      base44.entities.Medication.list("-created_date", 500).catch(() => []),
      base44.entities.Allergy.list().catch(() => []),
      base44.entities.Profile.list().catch(() => []),
    ]);
    // Only import each collection if the local DB is empty (don't overwrite
    // anything the user already created locally).
    const localMeds = await Medication.list();
    if (!localMeds.length && Array.isArray(meds) && meds.length) {
      for (const m of meds) await Medication.create(stripBuiltins(m));
    }
    const localAll = await Allergy.list();
    if (!localAll.length && Array.isArray(allergies) && allergies.length) {
      for (const a of allergies) await Allergy.create(stripBuiltins(a));
    }
    const localProf = await Profile.list();
    if (!localProf.length && Array.isArray(profiles) && profiles.length) {
      for (const p of profiles) await Profile.create(stripBuiltins(p));
    }
    // Mark the import done so it never runs again.
    localStorage.setItem("medilens_imported_v1", "1");
  } catch (e) {
    // ignore — will retry on the next online load
  }
}