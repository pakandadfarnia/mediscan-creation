import { useState, useMemo, useRef, useEffect } from "react";
import { checkInteractions } from "@/lib/interactions";

// Stable key for an interaction pair (uses stable per-med ids, not names, so
// translating a medication's display fields never changes the pair identity).
const keyOf = (f) => `${f.otcId}__${f.rxId}`;

// A composition signature of the med list — changes only on add/remove, not
// on field changes (e.g. language translation), so the modal logic only
// re-evaluates when the list actually changes.
const sigOf = (meds) => (Array.isArray(meds) ? meds.map((m) => m._cartId || m.id || m.name).join("|") : "");

// Manages the OTC ↔ prescription interaction check flow for a medication list.
//
// - `flags`: all currently detected interaction pairs (used for persistent tags).
// - `activeModal`: the interaction currently shown in the prominent modal, or null.
// - `acknowledge()`: dismiss the active modal (only path to close it). If more
//   new pairs were queued, the next one becomes active.
// - `reopen(flag)`: re-open a specific pair's modal (used when a persistent tag
//   is tapped).
//
// On first enable, existing pairs are recorded as "seen" so no modal fires for
// pairs that were already present (e.g. on library load). Only NEW pairs that
// appear from a later add trigger a modal. If a med in an active/queued pair is
// removed, that pair is dropped automatically.
export function useInteractionCheck(meds, { enabled = true } = {}) {
  const flags = useMemo(() => checkInteractions(meds), [meds]);
  const sig = useMemo(() => sigOf(meds), [meds]);
  const seenRef = useRef(null);
  const [queue, setQueue] = useState([]);
  const [active, setActive] = useState(null);

  // Seed "seen" on first enable, then queue modals for new pairs on add/remove.
  // Depends on `sig` + `enabled` only, so field changes don't re-fire modals.
  useEffect(() => {
    if (!enabled) return;
    if (seenRef.current === null) {
      seenRef.current = new Set(flags.map(keyOf));
      return;
    }
    const current = new Set(flags.map(keyOf));
    const fresh = flags.filter((f) => !seenRef.current.has(keyOf(f)));
    seenRef.current = current;
    if (fresh.length) setQueue((q) => [...q, ...fresh]);
  }, [sig, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-dismiss the active modal / queued items if one of the two meds is removed.
  useEffect(() => {
    const current = new Set(flags.map(keyOf));
    setQueue((q) => q.filter((f) => current.has(keyOf(f))));
    setActive((a) => (a && current.has(keyOf(a)) ? a : null));
  }, [flags]);

  // Promote the next queued pair when no modal is active.
  useEffect(() => {
    if (!active && queue.length) {
      setActive(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [active, queue]);

  const acknowledge = () => setActive(null);
  const reopen = (flag) => setActive(flag);

  return { flags, activeModal: active, acknowledge, reopen };
}