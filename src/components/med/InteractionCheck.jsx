import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, AlertTriangle, UtensilsCrossed, Pill, CheckCircle2 } from "lucide-react";

// Asks the backend (LLM) for drug-drug and drug-food interactions for `med`,
// comparing it against `others` (the rest of the patient's medications).
// Shows a loading state, an error fallback, or the interaction lists.
export default function InteractionCheck({ med, others }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const key = med?.id || med?.name;

  // Fetch interactions whenever the medication or comparison list changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setData(null);
    base44.functions
      .invoke("checkInteractions", { medication: med, others })
      .then((res) => {
        if (cancelled) return;
        const r = res.data?.result || res.data;
        setData({ drug_drug: r?.drug_drug || [], drug_food: r?.drug_food || [] });
      })
      .catch(() => !cancelled && setError("Couldn't check interactions right now."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [key, others?.length]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking drug &amp; food interactions…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-500">
        {error}
      </div>
    );
  }

  const dd = data.drug_drug;
  const df = data.drug_food;

  if (!dd.length && !df.length) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
        <CheckCircle2 className="h-4 w-4" /> No known drug-drug or drug-food interactions found.
      </div>
    );
  }

  const sev = (s) => s === "danger"
    ? "border-red-200 bg-red-50 text-red-800"
    : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className="space-y-3">
      {dd.length > 0 && (
        <div className={`rounded-2xl border p-4 ${sev("caution")}`}>
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            <span className="font-semibold">Drug–drug interaction{dd.length > 1 ? "s" : ""}</span>
          </div>
          <ul className="mt-2 space-y-2">
            {dd.map((d, i) => (
              <li key={i} className={`flex items-start gap-2 rounded-xl border bg-white/60 p-3 text-sm ${sev(d.severity)}`}>
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="font-medium">With {d.other_med}</span>
                  {d.ingredient ? ` (${d.ingredient})` : ""}: {d.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {df.length > 0 && (
        <div className={`rounded-2xl border p-4 ${sev("caution")}`}>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="font-semibold">Food &amp; drink to avoid</span>
          </div>
          <ul className="mt-2 space-y-2">
            {df.map((d, i) => (
              <li key={i} className={`flex items-start gap-2 rounded-xl border bg-white/60 p-3 text-sm ${sev(d.severity)}`}>
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="font-medium">{d.food}</span>: {d.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}