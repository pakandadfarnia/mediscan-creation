import React from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck, Lightbulb } from "lucide-react";
import { checkInteractions } from "@/../base44/shared/interactions";

// Shows OTC/supplement ↔ prescription interaction warnings using the curated
// client-side rule set (base44/shared/interactions). For each clash, when a
// safer over-the-counter option is known it is shown inline. If there are no
// clashes but the mix could have interactions (both OTC-like and Rx present),
// shows a reassuring "no known interactions" message — unless `showAllClear`
// is false, in which case it renders nothing.
export default function InteractionWarnings({ meds, showAllClear = true }) {
  const flags = checkInteractions(meds);
  if (!flags.length) {
    // Only show the all-clear when there's at least one OTC-like and one Rx med.
    if (!Array.isArray(meds) || meds.length < 2) return null;
    const hasOtc = meds.some((m) => m.category === "otc" || m.category === "supplement");
    const hasRx = meds.some((m) => m.category === "prescription");
    if (!hasOtc || !hasRx) return null;
    if (!showAllClear) return null;
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
          <span className="font-semibold">No known interactions with your other medicines</span>
        </div>
        <p className="mt-1 text-sm text-emerald-700">
          None of your over-the-counter medicines or supplements are known to clash with your prescriptions. Still, it's a good idea to check with your pharmacist.
        </p>
      </div>
    );
  }

  // Split warnings by severity so dangers (red) and cautions (amber) render separately.
  const dangers = flags.filter((f) => f.severity === "danger");
  const cautions = flags.filter((f) => f.severity === "caution");

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2 text-red-700">
        <ShieldAlert className="h-5 w-5" />
        <span className="font-semibold">Interaction warning</span>
      </div>
      <p className="mt-1 text-sm text-red-700">
        Some of your over-the-counter medicines or supplements can clash with your prescription medicines:
      </p>
      <ul className="mt-3 space-y-2">
        {dangers.map((f, i) => (
          <li key={`d${i}`} className="flex items-start gap-2 rounded-xl bg-white/70 p-3 text-sm text-red-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <span>
              <span className="font-semibold">{f.otc}</span> + <span className="font-semibold">{f.prescription}</span>
              <span className="block text-red-600">{f.message}</span>
              {f.alternative && (
                <span className="mt-2 flex items-start gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-800">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span><span className="font-semibold">Safer OTC option: </span>{f.alternative}</span>
                </span>
              )}
            </span>
          </li>
        ))}
        {cautions.map((f, i) => (
          <li key={`c${i}`} className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <span className="font-semibold">{f.otc}</span> + <span className="font-semibold">{f.prescription}</span>
              <span className="block text-amber-600">{f.message}</span>
              {f.alternative && (
                <span className="mt-2 flex items-start gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-emerald-800">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span><span className="font-semibold">Safer OTC option: </span>{f.alternative}</span>
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}