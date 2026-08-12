import React from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { checkInteractions } from "@/../base44/shared/interactions";

export default function InteractionWarnings({ meds }) {
  const flags = checkInteractions(meds);
  if (!flags.length) {
    if (!Array.isArray(meds) || meds.length < 2) return null;
    const hasOtc = meds.some((m) => m.category === "otc" || m.category === "supplement");
    const hasRx = meds.some((m) => m.category === "prescription");
    if (!hasOtc || !hasRx) return null;
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2 text-emerald-700">
          <ShieldCheck className="h-5 w-5" />
          <span className="font-semibold">No known major OTC/supplement interactions</span>
        </div>
        <p className="mt-1 text-sm text-emerald-700">
          None of your OTC or supplement items matched our list of known dangerous interactions with your prescriptions. This is not a substitute for a pharmacist review.
        </p>
      </div>
    );
  }

  const dangers = flags.filter((f) => f.severity === "danger");
  const cautions = flags.filter((f) => f.severity === "caution");

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2 text-red-700">
        <ShieldAlert className="h-5 w-5" />
        <span className="font-semibold">OTC / Supplement interaction warning</span>
      </div>
      <p className="mt-1 text-sm text-red-700">
        Some over-the-counter or supplement items you logged can dangerously interact with your prescription medications:
      </p>
      <ul className="mt-3 space-y-2">
        {dangers.map((f, i) => (
          <li key={`d${i}`} className="flex items-start gap-2 rounded-xl bg-white/70 p-3 text-sm text-red-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <span>
              <span className="font-semibold">{f.otc}</span> + <span className="font-semibold">{f.prescription}</span>
              <span className="block text-red-600">{f.message}</span>
            </span>
          </li>
        ))}
        {cautions.map((f, i) => (
          <li key={`c${i}`} className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <span>
              <span className="font-semibold">{f.otc}</span> + <span className="font-semibold">{f.prescription}</span>
              <span className="block text-amber-600">{f.message}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}