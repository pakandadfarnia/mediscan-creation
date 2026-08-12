import React from "react";
import { AlertTriangle } from "lucide-react";
import { checkDuplicates } from "@/../base44/shared/duplicateCheck";

// `med` is the newly scanned medication; `others` is everything already on the
// list (library + same scan batch, excluding `med` itself).
export default function DuplicateWarnings({ med, others }) {
  const flags = checkDuplicates(med, others);
  if (!flags.length) return null;
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-center gap-2 text-orange-800">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-semibold">Duplicate active ingredient</span>
      </div>
      <p className="mt-1 text-sm text-orange-800">
        This medication shares an active ingredient with something already on your list. Taking both can cause an accidental overdose.
      </p>
      <ul className="mt-3 space-y-2">
        {flags.map((f, i) => (
          <li key={i} className="flex items-start gap-2 rounded-xl bg-white/70 p-3 text-sm text-orange-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
            <span>
              <span className="font-semibold">{f.ingredientDisplay}</span>
              <span className="text-orange-700"> is also in </span>
              <span className="font-medium">{f.others.join(", ")}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}