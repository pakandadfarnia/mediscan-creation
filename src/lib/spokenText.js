// Composes plain-text strings for the Read aloud (text-to-speech) feature,
// using translated labels so it reads in the user's chosen language.

export function medicationSpokenText(med, t) {
  if (!med) return "";
  const parts = [];
  const add = (labelKey, v) => {
    if (v == null || v === "") return;
    const val = Array.isArray(v) ? v.filter(Boolean).join(", ") : v;
    if (val) parts.push(`${t(labelKey)}: ${val}`);
  };
  add("table.name", med.name);
  add("table.generic", med.generic_name);
  if (med.category) {
    const catKey = med.category === "prescription" ? "table.catRx" : med.category === "otc" ? "table.catOtc" : "table.catSupp";
    parts.push(`${t("table.category")}: ${t(catKey)}`);
  }
  add("table.dose", med.dose);
  add("table.form", med.form);
  add("table.frequency", med.frequency);
  add("table.route", med.route);
  add("table.quantity", med.quantity);
  add("table.purpose", med.purpose);
  add("table.active", med.active_ingredients);
  add("table.inactive", med.inactive_ingredients);
  add("table.sideEffects", med.side_effects);
  add("table.warnings", med.warnings);
  add("table.storage", med.storage);
  add("table.manufacturer", med.manufacturer);
  add("table.expiration", med.expiration_date);
  add("table.notes", med.notes);
  return parts.join(". ");
}

export function summarySpokenText(meds, t) {
  if (!meds || !meds.length) return t("scan.summaryTitle");
  const intro = `${t("scan.summaryTitle")}. ${t("scan.summaryDesc", { n: meds.length })}`;
  return intro + ". " + meds.map((m) => medicationSpokenText(m, t)).join(". ");
}