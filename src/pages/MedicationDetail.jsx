import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Medication, Allergy } from "@/lib/localDb";
import { Image } from "@/components/ui/image";
import { ArrowLeft, Loader2 } from "lucide-react";
import InfoTable from "@/components/med/InfoTable";
import SafetyPanel from "@/components/med/SafetyPanel";
import { useLang } from "@/lib/LanguageProvider";
import ReadAloudButton from "@/components/med/ReadAloudButton";
import { medicationSpokenText } from "@/lib/spokenText";
import { base44 } from "@/api/base44Client";

export default function MedicationDetail() {
  const { t, lang } = useLang();
  const id = new URLSearchParams(window.location.search).get("id");
  const [med, setMed] = useState(undefined);
  const [displayMed, setDisplayMed] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    if (!id) return setMed(null);
    Medication.get(id).then(setMed).catch(() => setMed(null));
    Allergy.list().then(setAllergies).catch(() => {});
    Medication.list("-created_date").then((list) => {
      setLibrary(list.filter((m) => m.id !== id));
    }).catch(() => {});
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

  return (
    <div>
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800">
        <ArrowLeft className="h-4 w-4" /> {t("detail.back")}
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">{shown.name}</h1>
      {shown.generic_name && <p className="mt-1 text-sm text-stone-500">{shown.generic_name}</p>}

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