// Cross-check a user's allergies against a medication's inactive ingredients.
// Returns matches: [{ allergen, ingredient }] for display.
export function checkAllergies(med, allergies) {
  const inactive = (med?.inactive_ingredients || []).map((s) => String(s || "").toLowerCase());
  const matches = [];
  (allergies || []).forEach((a) => {
    const term = String(a.name || "").trim().toLowerCase();
    if (!term) return;
    const hit = inactive.find((ing) =>
      ing === term ||
      ing.includes(term) ||
      term.includes(ing)
    );
    if (hit) matches.push({ allergen: a.name, ingredient: hit });
  });
  return matches;
}