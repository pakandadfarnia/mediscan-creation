import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { ArrowLeft } from "lucide-react";
import InfoTable from "@/components/med/InfoTable";
import AllergyWarnings from "@/components/med/AllergyWarnings";

export default function MedicationDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  const [med, setMed] = useState(undefined);
  const [allergies, setAllergies] = useState([]);

  useEffect(() => {
    if (!id) return setMed(null);
    base44.entities.Medication.get(id).then(setMed).catch(() => setMed(null));
    base44.entities.Allergy.list().then(setAllergies).catch(() => {});
  }, [id]);

  if (med === undefined) return <p className="text-sm text-stone-400">Loading…</p>;
  if (!med) return <p className="text-sm text-stone-500">Medication not found.</p>;

  return (
    <div>
      <Link to="/library" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800">
        <ArrowLeft className="h-4 w-4" /> Library
      </Link>
      <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">{med.name}</h1>
      {med.generic_name && <p className="mt-1 text-sm text-stone-500">{med.generic_name}</p>}

      {med.image_url && (
        <Image src={med.image_url} className="mt-6 h-56 w-full rounded-2xl object-cover" fittingType="fill" />
      )}

      <div className="mt-6">
        <AllergyWarnings med={med} allergies={allergies} />
      </div>
      <div className="mt-6">
        <InfoTable data={med} />
      </div>
    </div>
  );
}