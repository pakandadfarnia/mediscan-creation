// Curated set of well-established, clinically significant interactions between
// OTC medications / herbal supplements and common prescription drugs.
// Matching is keyword based (case-insensitive) on medication name + generic name.
// Returns flags for each OTC/supplement that has a dangerous interaction with a prescription.

// Each rule pairs a set of OTC/supplement keywords with a set of prescription
// keywords and a plain-language message shown when both are present.
const RULES = [
  {
    otc: ["ibuprofen", "advil", "motrin", "naproxen", "aleve", "nsaid", "diclofenac", "ketoprofen", "aspirin", "acetylsalicylic"],
    rx: ["warfarin", "coumadin", "eliquis", "apixaban", "xarelto", "rivaroxaban", "heparin", "enoxaparin", "clopidogrel", "plavix"],
    severity: "danger",
    message: "NSAID (ibuprofen/naproxen/aspirin) + blood thinner greatly increases bleeding risk.",
    alternative: "acetaminophen (Tylenol) for pain or fever — use the lowest dose for the shortest time, and tell your doctor.",
  },
  {
    otc: ["ibuprofen", "advil", "motrin", "naproxen", "aleve", "nsaid", "diclofenac"],
    rx: ["lisinopril", "enalapril", "ramipril", "losartan", "valsartan", "diovan", "benicar", "ace inhibitor", "ARB"],
    severity: "danger",
    message: "NSAIDs can reduce the blood-pressure effect of ACE inhibitors/ARBs and risk kidney injury.",
    alternative: "acetaminophen (Tylenol) for pain relief.",
  },
  {
    otc: ["st. john's wort", "st john's wort", "st johns wort", "hypericum", "sjw"],
    rx: ["sertraline", "zoloft", "fluoxetine", "prozac", "citalopram", "celexa", "escitalopram", "lexapro", "paroxetine", "paxil", "ssri", "venlafaxine", "effexor", "duloxetine", "cymbalta"],
    severity: "danger",
    message: "St. John's Wort + SSRI/SNRI can cause serotonin syndrome (agitation, fever, seizures).",
    alternative: "",
  },
  {
    otc: ["st. john's wort", "st john's wort", "st johns wort", "hypericum", "sjw"],
    rx: ["warfarin", "coumadin", "cyclosporine", "digoxin", "theophylline", "amiodarone"],
    severity: "danger",
    message: "St. John's Wort lowers blood levels of warfarin and several other prescription drugs, reducing their effect.",
    alternative: "",
  },
  {
    otc: ["st. john's wort", "st john's wort", "st johns wort", "hypericum", "sjw"],
    rx: ["ethinyl estradiol", "birth control", "oral contraceptive", "levonorgestrel"],
    severity: "danger",
    message: "St. John's Wort can reduce the effectiveness of oral contraceptives (unexpected pregnancy).",
    alternative: "",
  },
  {
    otc: ["ginkgo", "ginkgo biloba"],
    rx: ["warfarin", "coumadin", "eliquis", "apixaban", "xarelto", "rivaroxaban", "aspirin", "clopidogrel"],
    severity: "danger",
    message: "Ginkgo Biloba + blood thinner increases bleeding risk.",
    alternative: "",
  },
  {
    otc: ["garlic", "garlic extract", "garlic supplement"],
    rx: ["warfarin", "coumadin", "saquinavir"],
    severity: "caution",
    message: "Garlic supplements can increase bleeding risk with warfarin.",
    alternative: "",
  },
  {
    otc: ["ginseng", "panax ginseng"],
    rx: ["warfarin", "coumadin"],
    severity: "caution",
    message: "Ginseng may reduce warfarin's effect and alter INR.",
    alternative: "",
  },
  {
    otc: ["vitamin k", "vit k", "phytonadione", "leafy green supplement"],
    rx: ["warfarin", "coumadin"],
    severity: "danger",
    message: "Vitamin K supplements directly counteract warfarin's blood-thinning effect.",
    alternative: "",
  },
  {
    otc: ["kava", "kava kava", "piper methysticum"],
    rx: ["alprazolam", "xanax", "diazepam", "valium", "lorazepam", "ativan", "clonazepam", "klonopin", "zolpidem", "ambien", "benzodiazepine"],
    severity: "danger",
    message: "Kava + sedatives/benzodiazepines can cause dangerous oversedation.",
    alternative: "",
  },
  {
    otc: ["pseudoephedrine", "sudafed", "phenylephrine", "oxymetazoline", "decongestant"],
    rx: ["selegiline", "phenelzine", "tranylcypromine", "isocarboxazid", "maoi"],
    severity: "danger",
    message: "Decongestants (pseudoephedrine) + MAOI antidepressants can cause a hypertensive crisis.",
    alternative: "saline nasal spray or fluticasone (Flonase) for congestion.",
  },
  {
    otc: ["pseudoephedrine", "sudafed", "phenylephrine", "decongestant"],
    rx: ["lisinopril", "amlodipine", "metoprolol", "losartan", "atenolol", "blood pressure"],
    severity: "caution",
    message: "Decongestants can raise blood pressure and counteract blood-pressure medications.",
    alternative: "saline nasal spray or fluticasone (Flonase) for congestion.",
  },
  {
    otc: ["acetaminophen", "tylenol", "paracetamol"],
    rx: ["warfarin", "coumadin"],
    severity: "caution",
    message: "High-dose/regular acetaminophen can increase INR and bleeding risk with warfarin.",
    alternative: "",
  },
  {
    otc: ["iron", "ferrous", "iron supplement"],
    rx: ["levothyroxine", "synthroid", "thyroid hormone"],
    severity: "danger",
    message: "Iron supplements block absorption of levothyroxine — take at least 4 hours apart.",
    alternative: "",
  },
  {
    otc: ["calcium", "calcium carbonate", "calcium citrate", "antacid", "tums"],
    rx: ["levothyroxine", "synthroid", "tetracycline", "doxycycline", "ciprofloxacin", "cipro", "levofloxacin", "quinolone"],
    severity: "danger",
    message: "Calcium/antacids bind to thyroid hormone and certain antibiotics, blocking their absorption.",
    alternative: "",
  },
  {
    otc: ["grapefruit", "grapefruit juice"],
    rx: ["atorvastatin", "lipitor", "simvastatin", "zocor", "lovastatin", "statin", "amlodipine", "nifedipine", "felodipine", "cyclosporine"],
    severity: "danger",
    message: "Grapefruit/juice can sharply raise blood levels of many statins and blood-pressure drugs.",
    alternative: "orange or apple juice instead of grapefruit juice.",
  },
];

const norm = (s) => String(s || "").toLowerCase();

// Check a list of medications for OTC/supplement ↔ prescription interactions
// using the curated rules above. Returns a flag per matched pair.
export function checkInteractions(meds) {
  const flags = [];
  if (!Array.isArray(meds) || meds.length < 2) return flags;

  // Split the list into OTC-like items and prescriptions — interactions are
  // only flagged between these two groups.
  const otcLike = meds.filter((m) => m.category === "otc" || m.category === "supplement");
  const prescriptions = meds.filter((m) => m.category === "prescription");
  if (!otcLike.length || !prescriptions.length) return flags;

  // For each OTC/supplement, build a searchable text blob from its name, generic
  // name, purpose and inactive ingredients, then test it against every rule's
  // OTC keywords. On a hit, test each prescription against the rule's Rx keywords.
  for (const otc of otcLike) {
    const otcText = `${norm(otc.name)} ${norm(otc.generic_name)} ${norm(otc.purpose)} ${(otc.inactive_ingredients || []).map(norm).join(" ")}`;
    for (const rule of RULES) {
      if (!rule.otc.some((k) => otcText.includes(k))) continue;
      for (const rx of prescriptions) {
        const rxText = `${norm(rx.name)} ${norm(rx.generic_name)} ${norm(rx.purpose)}`;
        if (rule.rx.some((k) => rxText.includes(k))) {
          flags.push({
            otc: otc.name,
            prescription: rx.name,
            severity: rule.severity,
            message: rule.message,
            alternative: rule.alternative || "",
          });
        }
      }
    }
  }
  return flags;
}