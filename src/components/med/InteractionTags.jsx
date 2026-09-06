import React from "react";
import { AlertTriangle } from "lucide-react";

// Persistent, clickable "⚠ Interacts with [other]" tags attached to a
// medication. Renders one tag per interaction pair this med is involved in
// (so a med that interacts with two different drugs shows two tags). Tapping a
// tag re-opens the full warning modal for that pair (via onTagClick).
const medKey = (m) => m._cartId || m.id || m.name;

export default function InteractionTags({ med, flags, onTagClick }) {
  if (!flags || !flags.length || !med) return null;
  const myKey = medKey(med);
  const mine = flags.filter((f) => f.otcId === myKey || f.rxId === myKey);
  if (!mine.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {mine.map((f, i) => {
        const other = f.otcId === myKey ? f.prescription : f.otc;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onTagClick && onTagClick(f)}
            className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
          >
            <AlertTriangle className="h-3 w-3" /> Interacts with {other}
          </button>
        );
      })}
    </div>
  );
}