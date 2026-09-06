import React from "react";
import { Link } from "react-router-dom";
import { Pill, ShoppingCart, Leaf, Trash2, AlertTriangle, UtensilsCrossed, AlertOctagon } from "lucide-react";
import { checkAllergies } from "@/../base44/shared/allergyCheck";
import { useLang } from "@/lib/LanguageProvider";
import AllergyStopWarning from "@/components/med/AllergyStopWarning";
import OtcAlternativeWarning from "@/components/med/OtcAlternativeWarning";
import InteractionTags from "@/components/med/InteractionTags";

// Per-category badge styling (color + icon + label key).
const BADGE = {
  prescription: { cls: "bg-indigo-100 text-indigo-700", icon: Pill, labelKey: "table.catRx" },
  otc: { cls: "bg-amber-100 text-amber-700", icon: ShoppingCart, labelKey: "table.catOtc" },
  supplement: { cls: "bg-emerald-100 text-emerald-700", icon: Leaf, labelKey: "table.catSupp" },
};

// One medication in the library, with side effects, interactions and allergy
// warnings visible inline — no need to open the detail page to see them.
// Receives already-translated data from the Library page.
export default function LibraryCard({ med, allergies, onRemove, interactionFlags, onInteractionTagClick }) {
  const { t } = useLang();
  const cat = med.category || "prescription";
  const b = BADGE[cat] || BADGE.prescription;
  const Icon = b.icon;
  // Cross-check the (translated) med against the user's allergies — ingredient
  // names are kept standard by the translator, so matching still works.
  const allergyFlags = allergies?.length ? checkAllergies(med, allergies) : [];
  const hasAllergy = allergyFlags.length > 0;
  // OTC ↔ prescription conflicts get big warning blocks; other interactions stay
  // in the regular amber box.
  const otcConflicts = (med.drug_interactions || []).filter((d) => d.otc_med && d.rx_med);
  const dd = (med.drug_interactions || []).filter((d) => !(d.otc_med && d.rx_med));
  const df = med.food_interactions || [];
  const hasDD = dd.length > 0 || otcConflicts.length > 0;
  const sideEffects = med.side_effects || [];

  // Color the card border by the most severe issue: allergy (red) > interaction (amber) > none.
  const cardTone = hasAllergy
    ? "border-red-300 ring-1 ring-red-200"
    : hasDD
      ? "border-amber-300 ring-1 ring-amber-200"
      : "border-stone-200";

  return (
    <div className={`rounded-2xl border bg-white p-4 transition ${cardTone}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to={`/medication?id=${med.id}`} className="flex items-center gap-1.5 font-heading text-lg font-semibold text-stone-900 hover:underline">
            {hasAllergy && <AlertOctagon className="h-5 w-5 shrink-0 text-red-600" />}
            {med.name}
          </Link>
          {med.generic_name && <p className="truncate text-xs text-stone-400">{med.generic_name}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {hasAllergy && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
              <AlertTriangle className="h-3 w-3" /> {t("safety.allergy")}
            </span>
          )}
          {hasDD && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
              <Pill className="h-3 w-3" /> {t("library.interactionBadge")}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${b.cls}`}>
            <Icon className="h-3 w-3" /> {t(b.labelKey)}
          </span>
          <button onClick={() => onRemove(med.id)} className="text-stone-300 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <InteractionTags med={med} flags={interactionFlags} onTagClick={onInteractionTagClick} />
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-600">
        {med.dose && <span><span className="font-medium">{t("table.dose")}:</span> {med.dose}</span>}
        {med.frequency && <span><span className="font-medium">{t("table.frequency")}:</span> {med.frequency}</span>}
      </div>
      {med.purpose && <p className="mt-1 text-sm text-stone-600"><span className="font-medium">{t("table.purpose")}:</span> {med.purpose}</p>}

      {hasAllergy && (
        <div className="mt-3 space-y-2">
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-4 w-4" /> {t("safety.allergy")}
            </div>
            <ul className="mt-1 space-y-0.5">
              {allergyFlags.map((a, i) => (
                <li key={i}>
                  {a.allergen} → {a.ingredient}
                  {a.reaction && <span className="text-red-600"> — {a.reaction}</span>}
                </li>
              ))}
            </ul>
          </div>
          <AllergyStopWarning />
        </div>
      )}

      {sideEffects.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">{t("table.sideEffects")}</p>
          <p className="mt-0.5 text-sm text-stone-600">{sideEffects.join(" · ")}</p>
        </div>
      )}

      {otcConflicts.length > 0 && (
        <div className="mt-3 space-y-3">
          {otcConflicts.map((d, i) => (
            <OtcAlternativeWarning key={i} item={d} />
          ))}
        </div>
      )}

      {dd.length > 0 && (
        <div className="mt-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <div className="flex items-center gap-2 font-semibold">
            <Pill className="h-4 w-4 text-red-600" /> {t("safety.drugDrug")}
          </div>
          <ul className="mt-1 space-y-0.5">
            {dd.map((d, i) => (
              <li key={i}><span className="font-medium">{d.other_med}</span>: {d.description}</li>
            ))}
          </ul>
        </div>
      )}

      {df.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <div className="flex items-center gap-2 font-semibold">
            <UtensilsCrossed className="h-4 w-4" /> {t("safety.drugFood")}
          </div>
          <ul className="mt-1 space-y-0.5">
            {df.map((d, i) => (
              <li key={i}><span className="font-medium">{d.food}</span>: {d.description}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}