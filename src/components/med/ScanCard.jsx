import React, { useRef, useState } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import CameraCapture from "./CameraCapture";
import { useLang } from "@/lib/LanguageProvider";

// The big "scan a medication" card shown on the capture phase. Offers a camera
// button (opens CameraCapture) and an upload button (hidden file input). While
// busy, shows the current status text instead of the buttons.
export default function ScanCard({ onFile, busy, status }) {
  const { t } = useLang();
  const fileRef = useRef(null);
  const [camOpen, setCamOpen] = useState(false);

  // Handle a file chosen via the hidden input: reset the input so the same
  // file can be picked again, then pass it up.
  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onFile(file);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {busy ? <Loader2 className="h-7 w-7 animate-spin" /> : <Camera className="h-7 w-7" />}
      </div>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        {busy ? status : t("scanCard.title")}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {busy ? t("scanCard.busyDesc") : t("scanCard.desc")}
      </p>
      {!busy && (
        <p className="mx-auto mt-3 max-w-sm text-xs text-primary">{t("scanCard.hint")}</p>
      )}

      {!busy && (
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => setCamOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Camera className="h-4 w-4" /> {t("scanCard.camera")}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Upload className="h-4 w-4" /> {t("scanCard.upload")}
          </button>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
      {camOpen && (
        <CameraCapture
          onCapture={(f) => { setCamOpen(false); onFile(f); }}
          onClose={() => setCamOpen(false)}
        />
      )}
    </div>
  );
}