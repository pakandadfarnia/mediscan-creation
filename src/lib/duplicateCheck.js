// Detects when two medications share the same active ingredient, which risks
// accidental overdose (e.g. Percocet + Tylenol both contain acetaminophen).
// Frontend copy of the safety helper so client code never imports from the
// server-side base44/ folder.

// Normalize an ingredient string: lowercase, strip punctuation, collapse spaces.
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

// Synonyms / aliases mapped to a single canonical name, so different brand/
// generic spellings of the same drug collapse to one ingredient for matching.
const ALIASES = {
  acetaminophen: "acetaminophen",
  paracetamol: "acetaminophen",
  apap: "acetaminophen",
  "n acetyl p aminophenol": "acetaminophen",
  ibuprofen: "ibuprofen",
  "ibuprofeno": "ibuprofen",
  naproxen: "naproxen",
  "naproxen sodium": "naproxen",
  aspirin: "aspirin",
  acetylsalicylic: "aspirin",
  "acetylsalicylic acid": "aspirin",
  "asa": "aspirin",
  pseudoephedrine: "pseudoephedrine",
  phenylephrine: "phenylephrine",
  diphenhydramine: "diphenhydramine",
  cetirizine: "cetirizine",
  loratadine: "loratadine",
  omeprazole: "omeprazole",
  ranitidine: "ranitidine",
  famotidine: "famotidine",
  oxycodone: "oxycodone",
  hydrocodone: "hydrocodone",
  codeine: "codeine",
  tramadol: "tramadol",
  gabapentin: "gabapentin",
  metformin: "metformin",
  atorvastatin: "atorvastatin",
  simvastatin: "simvastatin",
  lisinopril: "lisinopril",
  amlodipine: "amlodipine",
  losartan: "losartan",
  levothyroxine: "levothyroxine",
  warfarin: "warfarin",
  sertraline: "sertraline",
  fluoxetine: "fluoxetine",
  esomeprazole: "esomeprazole",
};

// Return the canonical name for a raw ingredient string (alias-resolved).
function canonical(ing) {
  const n = norm(ing);
  return ALIASES[n] || n;
}

// Collect the set of canonical active ingredients for a medication.
export function activeIngredientSet(med) {
  const set = new Set();
  if (!med) return set;
  if (Array.isArray(med.active_ingredients)) {
    med.active_ingredients.forEach((i) => { const c = canonical(i); if (c) set.add(c); });
  }
  // Fall back to generic_name if no explicit active_ingredients, splitting on
  // common separators used for combination drugs ( "/", ",", " and ", "+" ).
  if ((!med.active_ingredients || med.active_ingredients.length === 0) && med.generic_name) {
    String(med.generic_name)
      .split(/[/,+]| and |\bwith\b/i)
      .map((s) => canonical(s))
      .forEach((c) => { if (c) set.add(c); });
  }
  return set;
}

// Friendlier display names for a few common ingredients (adds the brand name).
const DISPLAY = {
  acetaminophen: "Acetaminophen (Tylenol)",
  ibuprofen: "Ibuprofen (Advil/Motrin)",
  naproxen: "Naproxen (Aleve)",
  aspirin: "Aspirin",
  pseudoephedrine: "Pseudoephedrine (Sudafed)",
};

// Capitalize the first letter for ingredients without a special display name.
function display(name) {
  return DISPLAY[name] || name.charAt(0).toUpperCase() + name.slice(1);
}

// newMed: the medication just scanned.
// existingMeds: everything else already on the list (library + same scan batch).
// Returns flags: [{ ingredient, ingredientDisplay, others: [names], severity }]
// for each active ingredient that also appears in another medication.
export function checkDuplicates(newMed, existingMeds) {
  const flags = [];
  if (!newMed) return flags;
  const newIngs = activeIngredientSet(newMed);
  if (!newIngs.size) return flags;
  const others = (existingMeds || []).filter((m) => m && m !== newMed);
  for (const ing of newIngs) {
    const matches = others.filter((m) => activeIngredientSet(m).has(ing));
    if (matches.length) {
      flags.push({
        ingredient: ing,
        ingredientDisplay: display(ing),
        others: matches.map((m) => m.name),
        severity: "danger",
      });
    }
  }
  return flags;
}