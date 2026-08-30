// Cross-check a user's allergies against a medication's active AND inactive
// ingredients. Returns matches: [{ allergen, ingredient, source }] where
// source is "active" or "inactive", for display.
export function checkAllergies(med, allergies) {
  const normalize = (list) =>
    (list || [])
      .map((s) => String(s || "").trim().toLowerCase())
      .filter(Boolean);
  const active = normalize(med?.active_ingredients);
  const inactive = normalize(med?.inactive_ingredients);
  const matches = [];

  const findIn = (list, term) => {
    for (const ing of list) {
      if (!ing) continue;
      // exact, or the ingredient contains the allergen, or the allergen
      // contains the ingredient (only for non-trivial ingredient names to
      // avoid false positives like "a").
      if (ing === term || ing.includes(term) || (ing.length >= 3 && term.includes(ing))) {
        return ing;
      }
    }
    return null;
  };

  (allergies || []).forEach((a) => {
    const term = String(a.name || "").trim().toLowerCase();
    if (!term) return;
    const activeHit = findIn(active, term);
    if (activeHit) matches.push({ allergen: a.name, ingredient: activeHit, source: "active" });
    const inactiveHit = findIn(inactive, term);
    if (inactiveHit) matches.push({ allergen: a.name, ingredient: inactiveHit, source: "inactive" });
  });
  return matches;
}