import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import ScanCard from "@/components/med/ScanCard";
import CameraCapture from "@/components/med/CameraCapture";
import InfoTable from "@/components/med/InfoTable";
import { Plus, X, Camera, Upload, Loader2, Sparkles } from "lucide-react";

export default function Scan() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]); // {file, preview}
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [saving, setSaving] = useState(false);
  const [addingCam, setAddingCam] = useState(false);

  const addPhoto = (file) => {
    const preview = URL.createObjectURL(file);
    setPhotos((p) => [...p, { file, preview }]);
  };

  const removePhoto = (i) => {
    setPhotos((p) => {
      URL.revokeObjectURL(p[i].preview);
      return p.filter((_, idx) => idx !== i);
    });
  };

  const analyze = async () => {
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const urls = [];
      for (const ph of photos) {
        setStatus("Uploading photos…");
        const { file_url } = await base44.integrations.Core.UploadFile({ file: ph.file });
        urls.push(file_url);
      }
      setImageUrls(urls);
      setStatus("Reading the labels…");
      const res = await base44.functions.invoke("analyzeMedication", { image_urls: urls });
      const data = res.data?.result;
      if (!data || data.is_medication === false) {
        setError("We couldn't find a medication in those photos. Try a clearer shot of the label.");
      } else {
        setResult(data);
      }
    } catch (e) {
      setError("Something went wrong reading those photos. Please try again.");
    }
    setBusy(false);
  };

  const save = async () => {
    setSaving(true);
    const { is_medication, ...fields } = result;
    const created = await base44.entities.Medication.create({
      ...fields,
      image_url: imageUrls[0] || "",
    });
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    navigate(`/medication?id=${created.id}`);
  };

  const reset = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setResult(null);
    setImageUrls([]);
    setError("");
  };

  return (
    <div>
      <ScanCard onFile={addPhoto} busy={busy} status={status} />

      {photos.length > 0 && !busy && !result && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-stone-600">
            {photos.length} photo{photos.length > 1 ? "s" : ""} ready — add more if the label has more detail.
          </p>
          <div className="flex flex-wrap gap-3">
            {photos.map((p, i) => (
              <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-stone-200">
                <img src={p.preview} alt={`shot ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 bg-stone-900/80 px-1.5 py-0.5 text-[10px] text-white">Main</span>
                )}
              </div>
            ))}
            <button
              onClick={() => setAddingCam(true)}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-stone-300 text-stone-400 hover:bg-stone-100"
            >
              <Camera className="h-5 w-5" />
              <span className="text-[11px]">Take photo</span>
            </button>
            <button
              onClick={() => document.getElementById("add-more-file")?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-stone-300 text-stone-400 hover:bg-stone-100"
            >
              <Upload className="h-5 w-5" />
              <span className="text-[11px]">Upload</span>
            </button>
            <input
              id="add-more-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value=""; if (f) addPhoto(f); }}
            />
          </div>
          <button
            onClick={analyze}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white"
          >
            <Sparkles className="h-4 w-4" /> Analyze {photos.length} photo{photos.length > 1 ? "s" : ""}
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

      {result && (
        <div className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">{result.name}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={reset}
                className="rounded-full border border-stone-300 px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-100"
              >
                Rescan
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save to library"}
              </button>
            </div>
          </div>
          {imageUrls[0] && (
            <Image src={imageUrls[0]} className="mt-5 h-48 w-full rounded-2xl object-cover" fittingType="fill" />
          )}
          <div className="mt-5">
            <InfoTable data={result} />
          </div>
        </div>
      )}

      {addingCam && (
        <CameraCapture
          onCapture={(f) => { setAddingCam(false); addPhoto(f); }}
          onClose={() => setAddingCam(false)}
        />
      )}
    </div>
  );
}