import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Medication, Allergy } from "@/lib/localDb";
import { Image } from "@/components/ui/image";
import { ArrowLeft } from "lucide-react";
import InfoTable from "@/components/med/InfoTable";
import SafetyPanel from "@/components/med/SafetyPanel";
import { useLang } from "@/lib/LanguageProvider";
import ReadAloudButton from "@/components/med/ReadAloudButton";
import { medicationSpokenText } from "@/lib/spokenText";

export default function MedicationDetail() {
  const { t } = useLang();
  const id = new URLSearchParams(window.location.search).get("id");
  const [med, setMed] = useState(undefined);
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

  if (med === undefined) return <p className="text-sm text-stone-400">{t("common.loading")}</p>;
  if (!med) return <p className="text-sm text-stone-500">{t("detail.notFound")}</p>;

  return (
    <div>
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800">
        <ArrowLeft className="h-4 w-4" /> {t("detail.back")}
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">{med.name}</h1>
      {med.generic_name && <p className="mt-1 text-sm text-stone-500">{med.generic_name}</p>}

      <div className="mt-3">
        <ReadAloudButton text={medicationSpokenText(med, t)} />
      </div>

      {med.image_url && (
        <Image src={med.image_url} className="mt-6 h-56 w-full rounded-2xl object-cover" fittingType="fill" />
      )}

      <div className="mt-6">
        <SafetyPanel med={med} others={library} allergies={allergies} />
      </div>
      <div className="mt-6">
        <InfoTable data={med} />
      </div>
    </div>
  );
}