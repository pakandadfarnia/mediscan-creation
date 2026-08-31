// Cross-check a user's allergies against a medication's active AND inactive
// ingredients. Returns matches: [{ allergen, ingredient, source }] where
// source is "active" or "inactive", for display.
export function checkAllergies(med, allergies) {
  // Normalize an ingredient list to lowercase, trimmed, non-empty strings.
  const normalize = (list) =>
    (list || [])
      .map((s) => String(s || "").trim().toLowerCase())
      .filter(Boolean);
  const active = normalize(med?.active_ingredients);
  const inactive = normalize(med?.inactive_ingredients);
  const matches = [];

  // Look for an ingredient that matches an allergen term. Matches on exact
  // equality, the ingredient containing the allergen, or (for non-trivial
  // ingredient names) the allergen containing the ingredient — the last guard
  // avoids false positives from very short terms like "a".
  const findIn = (list, term) => {
    for (const ing of list) {
      if (!ing) continue;
      if (ing === term || ing.includes(term) || (ing.length >= 3 && term.includes(ing))) {
        return ing;
      }
    }
    return null;
  };

  // For each saved allergy, check both the active and inactive ingredient lists.
  // A single allergy can match in both lists, producing two match entries.
  (allergies || []).forEach((a) => {
    const term = String(a.name || "").trim().toLowerCase();
    if (!term) return;
    const activeHit = findIn(active, term);
    if (activeHit) matches.push({ allergen: a.name, ingredient: activeHit, source: "active", reaction: a.reaction, severity: a.severity });
    const inactiveHit = findIn(inactive, term);
    if (inactiveHit) matches.push({ allergen: a.name, ingredient: inactiveHit, source: "inactive", reaction: a.reaction, severity: a.severity });
  });
  return matches;
}