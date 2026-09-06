import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Medication, Allergy } from "@/lib/localDb";
import { Image } from "@/components/ui/image";
import { ArrowLeft, Loader2, AlertOctagon } from "lucide-react";
import InfoTable from "@/components/med/InfoTable";
import SafetyPanel from "@/components/med/SafetyPanel";
import AllergyStopWarning from "@/components/med/AllergyStopWarning";
import { checkAllergies } from "@/lib/allergyCheck";
import { useLang } from "@/lib/LanguageProvider";
import ReadAloudButton from "@/components/med/ReadAloudButton";
import { medicationSpokenText } from "@/lib/spokenText";
import { base44 } from "@/api/base44Client";

// Medication detail page: shows one medication's full info table plus a live
// safety panel. Translates the descriptive fields into the user's language for
// display while keeping the original record for allergy/interaction matching.
export default function MedicationDetail() {
  const { t, lang } = useLang();
  const id = new URLSearchParams(window.location.search).get("id");
  const [med, setMed] = useState(undefined);       // raw record (for safety checks)
  const [displayMed, setDisplayMed] = useState(null); // translated record (for display)
  const [translating, setTranslating] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [library, setLibrary] = useState([]);      // other meds, for interaction checks

  // Load the medication, the user's allergies, and the rest of the library.
  useEffect(() => {
    if (!id) return setMed(null);
    Medication.get(id)
      .then((m) => {
        setMed(m || null);
        if (!m) return;
        // Safety checks are scoped to the profile this medication belongs to.
        const pid = m.profile_id;
        Allergy.filter({ profile_id: pid }).then(setAllergies).catch(() => {});
        Medication.filter({ profile_id: pid }, "-created_date").then((list) => {
          setLibrary(list.filter((x) => x.id !== id));
        }).catch(() => {});
      })
      .catch(() => setMed(null));
  }, [id]);

  // Translate the medication's descriptive details into the user's preferred
  // language for display. The original (untranslated) record is kept for the
  // safety checks, which match against standard ingredient names.
  useEffect(() => {
    if (!med) return;
    if (lang === "en") { setDisplayMed(med); return; }
    let cancelled = false;
    setTranslating(true);
    base44.functions.invoke("translateMedication", { medication: med, language: lang })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.result;
        setDisplayMed(data || med);
      })
      .catch(() => { if (!cancelled) setDisplayMed(med); })
      .finally(() => { if (!cancelled) setTranslating(false); });
    return () => { cancelled = true; };
  }, [med, lang]);

  if (med === undefined) return <p className="text-sm text-stone-400">{t("common.loading")}</p>;
  if (!med) return <p className="text-sm text-stone-500">{t("detail.notFound")}</p>;

  const shown = displayMed || med;
  // Cross-check the original (untranslated) record against the user's allergies
  // so the stop-sign warning appears next to the name when there's a match.
  const allergyFlags = allergies?.length ? checkAllergies(med, allergies) : [];
  const hasAllergy = allergyFlags.length > 0;

  return (
    <div>
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800">
        <ArrowLeft className="h-4 w-4" /> {t("detail.back")}
      </Link>
      <h1 className="mt-4 flex items-center gap-2 font-heading text-3xl font-semibold tracking-tight">
        {hasAllergy && <AlertOctagon className="h-7 w-7 shrink-0 text-red-600" />}
        {shown.name}
      </h1>
      {shown.generic_name && <p className="mt-1 text-sm text-stone-500">{shown.generic_name}</p>}
      {hasAllergy && (
        <div className="mt-3">
          <AllergyStopWarning />
        </div>
      )}

      <div className="mt-3">
        <ReadAloudButton text={medicationSpokenText(shown, t)} />
      </div>

      {med.image_url && (
        <Image src={med.image_url} className="mt-6 h-56 w-full rounded-2xl object-cover" fittingType="fill" />
      )}

      <div className="mt-6">
        <SafetyPanel med={med} others={library} allergies={allergies} />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          {translating && (
            <span className="inline-flex items-center gap-1.5 text-xs text-stone-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("detail.translating")}
            </span>
          )}
        </div>
        <InfoTable data={shown} />
      </div>
    </div>
  );
}