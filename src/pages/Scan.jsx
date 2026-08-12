import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import ScanCard from "@/components/med/ScanCard";
import InfoTable from "@/components/med/InfoTable";

export default function Scan() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFile = async (file) => {
    setError("");
    setResult(null);
    setBusy(true);
    setStatus("Uploading photo…");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
      setStatus("Reading the label…");
      const res = await base44.functions.invoke("analyzeMedication", { image_url: file_url });
      const data = res.data?.result;
      if (!data || data.is_medication === false) {
        setError("We couldn't find a medication in that photo. Try a clearer shot of the label.");
      } else {
        setResult(data);
      }
    } catch (e) {
      setError("Something went wrong reading that photo. Please try again.");
    }
    setBusy(false);
  };

  const save = async () => {
    setSaving(true);
    const { is_medication, ...fields } = result;
    const created = await base44.entities.Medication.create({ ...fields, image_url: imageUrl });
    navigate(`/medication?id=${created.id}`);
  };

  return (
    <div>
      <ScanCard onFile={handleFile} busy={busy} status={status} />

      {error && (
        <p className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</p>
      )}

      {result && (
        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">{result.name}</h2>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save to library"}
            </button>
          </div>
          {imageUrl && (
            <Image src={imageUrl} className="mt-5 h-48 w-full rounded-2xl object-cover" fittingType="fill" />
          )}
          <div className="mt-5">
            <InfoTable data={result} />
          </div>
        </div>
      )}
    </div>
  );
}