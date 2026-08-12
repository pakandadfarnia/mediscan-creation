import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ScanCard from "@/components/med/ScanCard";
import CameraCapture from "@/components/med/CameraCapture";
import ConfirmForm from "@/components/med/ConfirmForm";
import SummaryTable from "@/components/med/SummaryTable";
import AllergyWarnings from "@/components/med/AllergyWarnings";
import { checkAllergies } from "@/../base44/shared/allergyCheck";
import { Plus, X, Camera, Upload, Check, Loader2 } from "lucide-react";

const PHASE = { CAPTURE: "capture", CONFIRM: "confirm", SUMMARY: "summary" };

export default function Scan() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(PHASE.CAPTURE);
  const [meds, setMeds] = useState([]); // confirmed medications
  const [photos, setPhotos] = useState([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [extracted, setExtracted] = useState(null);
  const [extractedImage, setExtractedImage] = useState("");
  const [addingCam, setAddingCam] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allergies, setAllergies] = useState([]);

  useEffect(() => { base44.entities.Allergy.list().then(setAllergies).catch(() => {}); }, []);

  const addPhoto = (file) => setPhotos((p) => [...p, { file, preview: URL.createObjectURL(file) }]);
  const removePhoto = (i) =>
    setPhotos((p) => { URL.revokeObjectURL(p[i].preview); return p.filter((_, idx) => idx !== i); });

  const analyze = async () => {
    setError("");
    setBusy(true);
    try {
      setStatus("Uploading photos…");
      const urls = [];
      for (const ph of photos) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: ph.file });
        urls.push(file_url);
      }
      setExtractedImage(urls[0] || "");
      setStatus("Reading the labels…");
      const res = await base44.functions.invoke("analyzeMedication", { image_urls: urls });
      const data = res.data?.result;
      if (!data || data.is_medication === false) {
        setError("We couldn't find a medication in those photos. Try a clearer shot of the label.");
      } else {
        setExtracted(data);
        setPhase(PHASE.CONFIRM);
      }
    } catch (e) {
      setError("Something went wrong reading those photos. Please try again.");
    }
    setBusy(false);
  };

  const resetCapture = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setExtracted(null);
    setExtractedImage("");
    setError("");
    setPhase(PHASE.CAPTURE);
  };

  const onConfirm = (med, done) => {
    setMeds((m) => [...m, { ...med, image_url: extractedImage }]);
    resetCapture();
    if (done) setPhase(PHASE.SUMMARY);
  };

  const saveAll = async () => {
    setSaving(true);
    const created = [];
    for (const m of meds) {
      const { is_medication, ...fields } = m;
      created.push(await base44.entities.Medication.create(fields));
    }
    setSaving(false);
    navigate("/library");
  };

  // ---- SUMMARY ----
  if (phase === PHASE.SUMMARY) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Your medications</h1>
        <p className="mt-1 text-sm text-stone-500">
          {meds.length} medication{meds.length > 1 ? "s" : ""} captured. Review the table, then save to your library.
        </p>
        <div className="mt-6">
          <SummaryTable meds={meds} />
        </div>

        {allergies.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium uppercase tracking-wider text-stone-500">Allergy cross-check</h3>
            {meds.map((m, i) => (
              <AllergyWarnings key={i} med={m} allergies={allergies} />
            ))}
            {!meds.some((m) => checkAllergies(m, allergies).length) && (
              <p className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                No inactive ingredients matched your recorded allergies. ✓
              </p>
            )}
          </div>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={() => { setMeds([]); resetCapture(); }}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Start over
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? "Saving…" : `Save ${meds.length} to library`}
          </button>
        </div>
      </div>
    );
  }

  // ---- CONFIRM ----
  if (phase === PHASE.CONFIRM) {
    return (
      <ConfirmForm
        data={extracted}
        imageUrl={extractedImage}
        allergies={allergies}
        onConfirm={onConfirm}
        onRescan={resetCapture}
      />
    );
  }

  // ---- CAPTURE ----
  return (
    <div>
      {meds.length > 0 && (
        <div className="mb-5 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <Check className="h-4 w-4" />
          {meds.length} medication{meds.length > 1 ? "s" : ""} added so far
          <button onClick={() => setPhase(PHASE.SUMMARY)} className="ml-auto font-medium underline">
            View table
          </button>
        </div>
      )}

      <ScanCard onFile={addPhoto} busy={busy} status={status} />

      {photos.length > 0 && !busy && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-stone-600">
            {photos.length} photo{photos.length > 1 ? "s" : ""} ready — add more if the label has more detail.
          </p>
          <div className="flex flex-wrap gap-3">
            {photos.map((p, i) => (
              <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-stone-200">
                <img src={p.preview} alt={`shot ${i + 1}`} className="h-full w-full object-cover" />
                <button onClick={() => removePhoto(i)} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button onClick={() => setAddingCam(true)} className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-stone-300 text-stone-400 hover:bg-stone-100">
              <Camera className="h-5 w-5" /><span className="text-[11px]">Take photo</span>
            </button>
            <button onClick={() => document.getElementById("add-more-file")?.click()} className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-stone-300 text-stone-400 hover:bg-stone-100">
              <Upload className="h-5 w-5" /><span className="text-[11px]">Upload</span>
            </button>
            <input id="add-more-file" type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value=""; if (f) addPhoto(f); }} />
          </div>
          <button onClick={analyze} className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white">
            <Plus className="h-4 w-4" /> Analyze {photos.length} photo{photos.length > 1 ? "s" : ""}
          </button>
        </div>
      )}

      {busy && photos.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {photos.map((p, i) => (
            <div key={i} className="h-24 w-24 overflow-hidden rounded-xl border border-stone-200 opacity-70">
              <img src={p.preview} alt={`shot ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">{error}</p>}

      {addingCam && (
        <CameraCapture
          onCapture={(f) => { setAddingCam(false); addPhoto(f); }}
          onClose={() => setAddingCam(false)}
        />
      )}
    </div>
  );
}