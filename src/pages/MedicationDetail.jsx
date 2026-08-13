import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { ArrowLeft } from "lucide-react";
import InfoTable from "@/components/med/InfoTable";
import AllergyWarnings from "@/components/med/AllergyWarnings";
import DuplicateWarnings from "@/components/med/DuplicateWarnings";
import InteractionCheck from "@/components/med/InteractionCheck";

export default function MedicationDetail() {
  const id = new URLSearchParams(window.location.search).get("id");
  const [med, setMed] = useState(undefined);
  const [allergies, setAllergies] = useState([]);
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    if (!id) return setMed(null);
    base44.entities.Medication.get(id).then(setMed).catch(() => setMed(null));
    base44.entities.Allergy.list().then(setAllergies).catch(() => {});
    base44.entities.Medication.list("-created_date").then((list) => {
      setLibrary(list.filter((m) => m.id !== id));
    }).catch(() => {});
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

      <div className="mt-6 space-y-4">
        <DuplicateWarnings med={med} others={library} />
        <AllergyWarnings med={med} allergies={allergies} />
      </div>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
          Drug &amp; food interactions
        </h3>
        <InteractionCheck med={med} others={library} />
      </div>
      <div className="mt-6">
        <InfoTable data={med} />
      </div>
    </div>
  );
}