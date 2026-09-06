import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { checkAllergies } from "@/../base44/shared/allergyCheck";
import { checkDuplicates } from "@/../base44/shared/duplicateCheck";
import OtcAlternativeWarning from "@/components/med/OtcAlternativeWarning";
import InteractionTags from "@/components/med/InteractionTags";
import { useLang } from "@/lib/LanguageProvider";
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2, Ban } from "lucide-react";

// A single, compact panel that consolidates allergy, duplicate-ingredient,
// drug-drug and drug-food checks for one medication. Allergy and duplicate
// checks run locally (instant); drug/food interactions are fetched from the
// checkInteractions backend function in the user's language.
export default function SafetyPanel({ med, others, allergies, interactionFlags, onInteractionTagClick }) {
  const { t, lang } = useLang();
  const [inter, setInter] = useState(null);  // LLM drug/food interaction results
  const [loading, setLoading] = useState(true);
  const key = med?.id || med?.name;

  // Fetch drug/food interactions whenever the medication, the comparison list,
  // or the language changes. Re-runs so descriptions stay in the active language.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setInter(null);
    base44.functions
      .invoke("checkInteractions", { medication: med, others, language: lang })
      .then((res) => {
        if (cancelled) return;
        const r = res.data?.result || res.data;
        setInter({ drug_drug: r?.drug_drug || [], drug_food: r?.drug_food || [] });
      })
      .catch(() => !cancelled && setInter({ drug_drug: [], drug_food: [] }))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [key, others?.length, lang]);

  // Run the local (instant) allergy and duplicate-ingredient checks against
  // the original med so standard ingredient names are matched correctly.
  const allergyFlags = allergies && allergies.length ? checkAllergies(med, allergies) : [];
  const dupFlags = checkDuplicates(med, others);
  const dd = inter?.drug_drug || [];
  const df = inter?.drug_food || [];
  // OTC ↔ prescription conflicts get their own big warning blocks; the
  // remaining drug interactions render as regular warning rows below.
  const otcConflicts = dd.filter((d) => d.otc_med && d.rx_med);
  const plainDD = dd.filter((d) => !(d.otc_med && d.rx_med));

  const hasAllergy = allergyFlags.length > 0;
  // Build a single ordered list of warning rows to render (allergies first,
  // then duplicates, then drug-drug, then drug-food), each tagged with a tone.
  const rows = [];
  allergyFlags.forEach((a) =>
    rows.push({ tone: "danger", label: t("safety.allergy"), detail: t("safety.allergyMsg", { x: a.ingredient }) })
  );
  dupFlags.forEach((f) =>
    rows.push({ tone: "caution", label: t("safety.duplicate"), detail: t("safety.duplicateMsg", { x: f.ingredientDisplay, others: f.others.join(", ") }) })
  );
  plainDD.forEach((d) =>
    rows.push({ tone: d.severity === "danger" ? "danger" : "caution", label: t("safety.drugDrug"), detail: `${t("safety.with", { med: d.other_med })}: ${d.description}` })
  );
  df.forEach((d) =>
    rows.push({ tone: d.severity === "danger" ? "danger" : "caution", label: t("safety.drugFood"), detail: `${d.food}: ${d.description}` })
  );

  const TONE = {
    danger: { wrap: "border-red-200 bg-red-50", text: "text-red-800", icon: "text-red-500" },
    caution: { wrap: "border-amber-200 bg-amber-50", text: "text-amber-800", icon: "text-amber-500" },
  };

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-800">
          <ShieldCheck className="h-4 w-4 text-stone-500" />
          {t("safety.title")}
        </div>
        <span className="truncate text-xs font-medium text-stone-400">{med.name}</span>
      </div>
      <InteractionTags med={med} flags={interactionFlags} onTagClick={onInteractionTagClick} />

      {loading ? (
        <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("safety.checking")}
        </div>
      ) : rows.length === 0 && otcConflicts.length === 0 ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> {t("safety.noIssues")}
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {otcConflicts.length > 0 && (
            <div className="space-y-3">
              {otcConflicts.map((d, i) => (
                <OtcAlternativeWarning key={i} item={d} />
              ))}
            </div>
          )}
          {hasAllergy && (
            <div className="flex items-start gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-semibold text-white">
              <Ban className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{t("safety.doNotUse")}</span>
            </div>
          )}
          <ul className="space-y-2">
            {rows.map((r, i) => {
              const tone = TONE[r.tone];
              return (
                <li key={i} className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${tone.wrap} ${tone.text}`}>
                  <AlertTriangle className={`mt-0.5 h-4 w-4 shrink-0 ${tone.icon}`} />
                  <span><span className="font-medium">{r.label}:</span> {r.detail}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}