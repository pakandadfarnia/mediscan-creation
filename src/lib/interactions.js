// Curated interaction dataset between over-the-counter (OTC) / supplement
// medications and common prescription drugs.
//
// Dataset "columns":
//   - otc:        OTC/supplement drug name keywords (matched against name,
//                 generic_name, purpose, inactive_ingredients)
//   - rx:         prescription drug name keywords (matched against name,
//                 generic_name, purpose)
//   - category:   drug category / use case (e.g. "Pain reliever", "Decongestant")
//   - severity:   "danger" (red) or "caution" (orange)
//   - risk:       plain-language description of the risk of the pair
//   - alternatives: 1–3 safer OTC options for the SAME category/use case, each
//                   with a one-line reason it is safer. Empty array when no
//                   safe OTC alternative exists (the UI then tells the user to
//                   consult a physician/pharmacist).
//
// Matching is keyword based (case-insensitive). Returns a flag per matched
// OTC–prescription pair.
const RULES = [
  {
    otc: ["ibuprofen", "advil", "motrin", "naproxen", "aleve", "nsaid", "diclofenac", "ketoprofen", "aspirin", "acetylsalicylic"],
    rx: ["warfarin", "coumadin", "eliquis", "apixaban", "xarelto", "rivaroxaban", "heparin", "enoxaparin", "clopidogrel", "plavix"],
    category: "Pain reliever (NSAID)",
    severity: "danger",
    risk: "Ibuprofen/naproxen/aspirin can greatly increase bleeding risk when taken with a blood thinner.",
    alternatives: [
      { name: "Acetaminophen (Tylenol)", reason: "Relieves pain and fever without thinning the blood or raising bleeding risk." },
    ],
  },
  {
    otc: ["ibuprofen", "advil", "motrin", "naproxen", "aleve", "nsaid", "diclofenac"],
    rx: ["lisinopril", "enalapril", "ramipril", "losartan", "valsartan", "diovan", "benicar", "ace inhibitor", "ARB"],
    category: "Pain reliever (NSAID)",
    severity: "danger",
    risk: "NSAIDs can reduce the blood-pressure effect of ACE inhibitors/ARBs and risk kidney injury.",
    alternatives: [
      { name: "Acetaminophen (Tylenol)", reason: "Eases pain without affecting blood pressure or kidney function." },
    ],
  },
  {
    otc: ["st. john's wort", "st john's wort", "st johns wort", "hypericum", "sjw"],
    rx: ["sertraline", "zoloft", "fluoxetine", "prozac", "citalopram", "celexa", "escitalopram", "lexapro", "paroxetine", "paxil", "ssri", "venlafaxine", "effexor", "duloxetine", "cymbalta"],
    category: "Herbal supplement (mood)",
    severity: "danger",
    risk: "St. John's Wort + SSRI/SNRI can cause serotonin syndrome (agitation, fever, seizures).",
    alternatives: [],
  },
  {
    otc: ["st. john's wort", "st john's wort", "st johns wort", "hypericum", "sjw"],
    rx: ["warfarin", "coumadin", "cyclosporine", "digoxin", "theophylline", "amiodarone"],
    category: "Herbal supplement (mood)",
    severity: "danger",
    risk: "St. John's Wort lowers blood levels of warfarin and several other prescription drugs, reducing their effect.",
    alternatives: [],
  },
  {
    otc: ["st. john's wort", "st john's wort", "st johns wort", "hypericum", "sjw"],
    rx: ["ethinyl estradiol", "birth control", "oral contraceptive", "levonorgestrel"],
    category: "Herbal supplement (mood)",
    severity: "danger",
    risk: "St. John's Wort can reduce the effectiveness of oral contraceptives (unexpected pregnancy).",
    alternatives: [],
  },
  {
    otc: ["ginkgo", "ginkgo biloba"],
    rx: ["warfarin", "coumadin", "eliquis", "apixaban", "xarelto", "rivaroxaban", "aspirin", "clopidogrel"],
    category: "Herbal supplement (circulation)",
    severity: "danger",
    risk: "Ginkgo Biloba + a blood thinner increases bleeding risk.",
    alternatives: [],
  },
  {
    otc: ["garlic", "garlic extract", "garlic supplement"],
    rx: ["warfarin", "coumadin", "saquinavir"],
    category: "Herbal supplement (heart)",
    severity: "caution",
    risk: "Garlic supplements can increase bleeding risk with warfarin.",
    alternatives: [],
  },
  {
    otc: ["ginseng", "panax ginseng"],
    rx: ["warfarin", "coumadin"],
    category: "Herbal supplement (energy)",
    severity: "caution",
    risk: "Ginseng may reduce warfarin's effect and alter INR.",
    alternatives: [],
  },
  {
    otc: ["vitamin k", "vit k", "phytonadione", "leafy green supplement"],
    rx: ["warfarin", "coumadin"],
    category: "Supplement (vitamin)",
    severity: "danger",
    risk: "Vitamin K supplements directly counteract warfarin's blood-thinning effect.",
    alternatives: [],
  },
  {
    otc: ["kava", "kava kava", "piper methysticum"],
    rx: ["alprazolam", "xanax", "diazepam", "valium", "lorazepam", "ativan", "clonazepam", "klonopin", "zolpidem", "ambien", "benzodiazepine"],
    category: "Herbal supplement (sleep/anxiety)",
    severity: "danger",
    risk: "Kava + sedatives/benzodiazepines can cause dangerous oversedation.",
    alternatives: [],
  },
  {
    otc: ["pseudoephedrine", "sudafed", "phenylephrine", "oxymetazoline", "decongestant"],
    rx: ["selegiline", "phenelzine", "tranylcypromine", "isocarboxazid", "maoi"],
    category: "Decongestant",
    severity: "danger",
    risk: "Decongestants (pseudoephedrine) + MAOI antidepressants can cause a hypertensive crisis.",
    alternatives: [
      { name: "Saline nasal spray", reason: "Clears congestion without raising blood pressure or interacting with MAOIs." },
      { name: "Fluticasone (Flonase)", reason: "A steroid nasal spray that treats congestion without systemic effects." },
    ],
  },
  {
    otc: ["pseudoephedrine", "sudafed", "phenylephrine", "decongestant"],
    rx: ["lisinopril", "amlodipine", "metoprolol", "losartan", "atenolol", "blood pressure"],
    category: "Decongestant",
    severity: "caution",
    risk: "Decongestants can raise blood pressure and counteract blood-pressure medications.",
    alternatives: [
      { name: "Saline nasal spray", reason: "Relieves congestion without affecting blood pressure." },
      { name: "Fluticasone (Flonase)", reason: "Steroid nasal spray that treats congestion without raising blood pressure." },
    ],
  },
  {
    otc: ["acetaminophen", "tylenol", "paracetamol"],
    rx: ["warfarin", "coumadin"],
    category: "Pain reliever",
    severity: "caution",
    risk: "High-dose or regular acetaminophen can increase INR and bleeding risk with warfarin.",
    alternatives: [],
  },
  {
    otc: ["iron", "ferrous", "iron supplement"],
    rx: ["levothyroxine", "synthroid", "thyroid hormone"],
    category: "Supplement (mineral)",
    severity: "danger",
    risk: "Iron supplements block absorption of levothyroxine — take at least 4 hours apart.",
    alternatives: [],
  },
  {
    otc: ["calcium", "calcium carbonate", "calcium citrate", "antacid", "tums"],
    rx: ["levothyroxine", "synthroid", "tetracycline", "doxycycline", "ciprofloxacin", "cipro", "levofloxacin", "quinolone"],
    category: "Antacid / mineral supplement",
    severity: "danger",
    risk: "Calcium/antacids bind to thyroid hormone and certain antibiotics, blocking their absorption.",
    alternatives: [],
  },
  {
    otc: ["grapefruit", "grapefruit juice"],
    rx: ["atorvastatin", "lipitor", "simvastatin", "zocor", "lovastatin", "statin", "amlodipine", "nifedipine", "felodipine", "cyclosporine"],
    category: "Food / juice",
    severity: "danger",
    risk: "Grapefruit or grapefruit juice can sharply raise blood levels of many statins and blood-pressure drugs.",
    alternatives: [
      { name: "Orange juice", reason: "Doesn't block the enzyme that raises statin blood levels." },
      { name: "Apple juice", reason: "A safe alternative that doesn't affect statin metabolism." },
    ],
  },
];

const norm = (s) => String(s || "").toLowerCase();

// Stable per-med identifier: a cart item id (scan flow), the DB id (library),
// or the name as a last resort.
const medKey = (m) => m._cartId || m.id || m.name;

// Check a list of medications for OTC/supplement ↔ prescription interactions
// using the curated rules above. Returns one flag per matched pair.
export function checkInteractions(meds) {
  const flags = [];
  if (!Array.isArray(meds) || meds.length < 2) return flags;

  // Interactions are only flagged between OTC-like items and prescriptions.
  const otcLike = meds.filter((m) => m.category === "otc" || m.category === "supplement");
  const prescriptions = meds.filter((m) => m.category === "prescription");
  if (!otcLike.length || !prescriptions.length) return flags;

  for (const otc of otcLike) {
    const otcText = `${norm(otc.name)} ${norm(otc.generic_name)} ${norm(otc.purpose)} ${(otc.inactive_ingredients || []).map(norm).join(" ")}`;
    for (const rule of RULES) {
      if (!rule.otc.some((k) => otcText.includes(k))) continue;
      for (const rx of prescriptions) {
        const rxText = `${norm(rx.name)} ${norm(rx.generic_name)} ${norm(rx.purpose)}`;
        if (rule.rx.some((k) => rxText.includes(k))) {
          flags.push({
            otc: otc.name,
            otcId: medKey(otc),
            prescription: rx.name,
            rxId: medKey(rx),
            category: rule.category,
            severity: rule.severity,
            risk: rule.risk,
            alternatives: rule.alternatives || [],
          });
        }
      }
    }
  }
  return flags;
}