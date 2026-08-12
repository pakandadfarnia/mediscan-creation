import React, { useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";

export default function ScanCard({ onFile, busy, status }) {
  const cameraRef = useRef(null);
  const fileRef = useRef(null);

  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onFile(file);
  };

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        {busy ? <Loader2 className="h-7 w-7 animate-spin" /> : <Camera className="h-7 w-7" />}
      </div>
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        {busy ? status : "Scan a medication"}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
        {busy
          ? "Hang tight while we read the label."
          : "Take a photo of the box, bottle or blister pack and we'll pull the details into a table."}
      </p>

      {!busy && (
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => cameraRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Camera className="h-4 w-4" /> Take photo
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
          >
            <Upload className="h-4 w-4" /> Upload image
          </button>
        </div>
      )}

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={pick} />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
    </div>
  );
}