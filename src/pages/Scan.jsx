import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ScanCard from "@/components/med/ScanCard";
import CameraCapture from "@/components/med/CameraCapture";
import ConfirmForm from "@/components/med/ConfirmForm";
import SummaryTable from "@/components/med/SummaryTable";
import SafetyPanel from "@/components/med/SafetyPanel";
import InteractionModal from "@/components/med/InteractionModal";
import { useInteractionCheck } from "@/lib/useInteractionCheck";
import { downloadMedicationsPdf } from "@/lib/exportMedications";
import { useLang } from "@/lib/LanguageProvider";
import { langName } from "@/lib/i18n";
import ReadAloudButton from "@/components/med/ReadAloudButton";
import { summarySpokenText } from "@/lib/spokenText";
import { Medication, Allergy, Profile } from "@/lib/localDb";
import { checkAllergies } from "@/../base44/shared/allergyCheck";
import { getScanSession, updateScanSession, clearScanSession } from "@/lib/scanSession";
import { Plus, X, Camera, Upload, Check, Loader2, Download } from "lucide-react";

// The three stages of the scan flow: taking photos, confirming extracted
// details, and reviewing the summary table before saving to the library.
const PHASE = { CAPTURE: "capture", CONFIRM: "confirm", SUMMARY: "summary" };

// Scan page: the app's home. Guides the user through capturing one or more
// photos of a medication label, extracting its data with the analyzeMedication
// backend function, confirming/editing the details, and finally saving the
// batch to the local library (after running allergy + interaction checks).
export default function Scan() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const session = getScanSession();
  const [phase, setPhase] = useState(session.phase);
  const [meds, setMeds] = useState(session.meds);
  const [photos, setPhotos] = useState(session.photos);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [extracted, setExtracted] = useState(session.extracted);
  const [extractedImage, setExtractedImage] = useState(session.extractedImage);
  const [addingCam, setAddingCam] = useState(false);
  const [saving, setSaving] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [library, setLibrary] = useState([]);
  const [profileName, setProfileName] = useState("");
  const cartIdRef = useRef(0);
  // OTC ↔ prescription interaction check: fires a prominent modal when a new
  // interacting pair is created by adding a med, and exposes persistent tags
  // for each interacting med. Re-evaluates only when the cart list changes.
  const { flags: interactionFlags, activeModal, acknowledge, reopen } = useInteractionCheck(meds);

  // Load the user's allergies, existing library and profile name once on
  // mount — allergies power the inline allergy checks, the library powers
  // duplicate/interaction checks, and the profile name labels the PDF export.
  useEffect(() => {
    Allergy.list().then(setAllergies).catch(() => {});
    Medication.list("-created_date").then(setLibrary).catch(() => {});
    Profile.list().then((list) => setProfileName((list && list[0]?.name) || "")).catch(() => {});
  }, []);

  // Persist the scan session so navigating away and back keeps your photos
  // and scanned details until you save or start over.
  useEffect(() => { updateScanSession({ phase }); }, [phase]);
  useEffect(() => { updateScanSession({ meds }); }, [meds]);
  useEffect(() => { updateScanSession({ photos }); }, [photos]);
  useEffect(() => { updateScanSession({ extracted }); }, [extracted]);
  useEffect(() => { updateScanSession({ extractedImage }); }, [extractedImage]);

  // Re-translate scanned medications when the language changes on the summary
  // page so the table stays in the user's selected language.
  const prevLang = useRef(lang);
  useEffect(() => {
    if (phase !== PHASE.SUMMARY) return;
    if (prevLang.current === lang) return;
    prevLang.current = lang;
    if (meds.length === 0) return;
    let cancelled = false;
    setBusy(true);
    setStatus(t("detail.translating"));
    Promise.all(meds.map(async (m) => {
      try {
        const res = await base44.functions.invoke("translateMedication", { medication: m, language: lang });
        const data = res.data?.result;
        return data ? { ...m, ...data } : m;
      } catch { return m; }
    })).then((translated) => {
      if (!cancelled) setMeds(translated);
    }).finally(() => {
      if (!cancelled) { setBusy(false); setStatus(""); }
    });
    return () => { cancelled = true; };
  }, [lang, phase]);

  // Add a captured/uploaded photo (with a local preview URL) to the batch.
  const addPhoto = (file) => setPhotos((p) => [...p, { file, preview: URL.createObjectURL(file) }]);
  // Remove a photo from the batch and free its preview URL.
  const removePhoto = (i) =>
    setPhotos((p) => { URL.revokeObjectURL(p[i].preview); return p.filter((_, idx) => idx !== i); });

  // Upload all photos, then call analyzeMedication to extract the medication
  // data. If the user's language isn't English, translate the result before
  // showing the confirm form. Surfaces a specific failure reason on error.
  const analyze = async () => {
    setError("");
    setBusy(true);
    try {
      setStatus(t("scan.uploading"));
      const urls = [];
      for (const ph of photos) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: ph.file });
        urls.push(file_url);
      }
      setExtractedImage(urls[0] || "");
      setStatus(t("scan.reading"));
      const res = await base44.functions.invoke("analyzeMedication", { image_urls: urls });
      const data = res.data?.result;
      if (!data || data.is_medication === false) {
        setError(t("scan.notMed"));
      } else {
        let finalData = data;
        if (lang !== "en") {
          setStatus(t("detail.translating"));
          try {
            const tr = await base44.functions.invoke("translateMedication", { medication: data, language: lang });
            const translated = tr.data?.result;
            if (translated) finalData = { ...data, ...translated };
          } catch {
            // translation optional — fall back to original extracted data
          }
        }
        setExtracted(finalData);
        setPhase(PHASE.CONFIRM);
      }
    } catch (e) {
      const reason = e?.message || e?.error || (typeof e === "string" ? e : "unknown error");
      setError(`${t("scan.error")} — ${reason}`);
    }
    setBusy(false);
  };

  // Clear the current capture (photos + extracted data) and return to the
  // capture phase, freeing the preview URLs.
  const resetCapture = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.preview));
    setPhotos([]);
    setExtracted(null);
    setExtractedImage("");
    setError("");
    setPhase(PHASE.CAPTURE);
  };

  // Called by the confirm form: add the confirmed med to the batch, reset the
  // capture, and (if "Done") jump to the summary table.
  const onConfirm = (med, done) => {
    setMeds((m) => [...m, { ...med, image_url: extractedImage, _cartId: ++cartIdRef.current }]);
    resetCapture();
    if (done) setPhase(PHASE.SUMMARY);
  };

  // Save every confirmed med to the local library. For each one we compute
  // allergy warnings, then ask checkInteractions (in the user's language) for
  // drug/food interactions against the rest of the list, and persist it all.
  const saveAll = async () => {
    setSaving(true);
    const allOthers = [...library, ...meds];
    for (const m of meds) {
      const { is_medication, ...fields } = m;
      const others = allOthers.filter((x) => x !== m);
      const allergyWarnings = checkAllergies(m, allergies);
      let drug_interactions = [];
      let food_interactions = [];
      try {
        const res = await base44.functions.invoke("checkInteractions", { medication: m, others, language: lang });
        const r = res.data?.result || res.data;
        drug_interactions = r?.drug_drug || [];
        food_interactions = r?.drug_food || [];
      } catch {
        // offline or failed — store empty; can be refreshed later
      }
      await Medication.create({ ...fields, allergy_warnings: allergyWarnings, drug_interactions, food_interactions });
    }
    setSaving(false);
    clearScanSession();
    navigate("/library");
  };

  // Export the current batch as a localized PDF in the chosen language.
  const exportPdf = async (forLang) => {
    const file = forLang === "en" ? "medications_en.pdf" : `medications_${forLang}.pdf`;
    await downloadMedicationsPdf(meds, forLang, profileName, file);
  };

  if (phase === PHASE.SUMMARY) {
    return (
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("scan.summaryTitle")}</h1>
        <p className="mt-1 text-sm text-stone-500">{t("scan.summaryDesc", { n: meds.length })}</p>
        {busy && (
          <div className="mt-4 flex items-center gap-2 text-sm text-stone-500">
            <Loader2 className="h-4 w-4 animate-spin" /> {status}
          </div>
        )}
        <div className="mt-6">
          <SummaryTable meds={meds} />
        </div>

        <div className="mt-4">
          <ReadAloudButton text={summarySpokenText(meds, t)} />
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">{t("scan.safetySection")}</h3>
          <div className="space-y-3">
            {meds.map((m, i) => (
              <SafetyPanel key={i} med={m} others={[...library, ...meds.filter((x) => x !== m)]} allergies={allergies} interactionFlags={interactionFlags} onInteractionTagClick={reopen} />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">{t("scan.exportTitle")}</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportPdf(lang)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white"
            >
              <Download className="h-4 w-4" /> {t("export.downloadPref", { lang: langName(lang) })}
            </button>
            {lang !== "en" && (
              <button
                onClick={() => exportPdf("en")}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                <Download className="h-4 w-4" /> {t("export.downloadEn")}
              </button>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={() => { setMeds([]); resetCapture(); }}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            {t("scan.startOver")}
          </button>
          <button
            onClick={saveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {saving ? t("common.loading") : t("scan.saveN", { n: meds.length })}
          </button>
        </div>

        <InteractionModal flag={activeModal} onAcknowledge={acknowledge} />
      </div>
    );
  }

  if (phase === PHASE.CONFIRM) {
    return (
      <ConfirmForm
        data={extracted}
        imageUrl={extractedImage}
        allergies={allergies}
        others={[...library, ...meds]}
        onConfirm={onConfirm}
        onRescan={resetCapture}
      />
    );
  }

  return (
    <div>
      {meds.length > 0 && (
        <div className="mb-5 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <Check className="h-4 w-4" />
          {t("scan.addedSoFar", { n: meds.length })}
          <button onClick={() => setPhase(PHASE.SUMMARY)} className="ml-auto font-medium underline">
            {t("scan.viewTable")}
          </button>
        </div>
      )}

      <ScanCard onFile={addPhoto} busy={busy} status={status} />

      {photos.length > 0 && !busy && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium text-stone-600">{t("scan.photosReady", { n: photos.length })}</p>
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
              <Camera className="h-5 w-5" /><span className="text-[11px]">{t("scan.takePhoto")}</span>
            </button>
            <button onClick={() => document.getElementById("add-more-file")?.click()} className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-stone-300 text-stone-400 hover:bg-stone-100">
              <Upload className="h-5 w-5" /><span className="text-[11px]">{t("scan.upload")}</span>
            </button>
            <input id="add-more-file" type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) addPhoto(f); }} />
          </div>
          <button onClick={analyze} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white">
            <Plus className="h-4 w-4" /> {t("scan.analyze", { n: photos.length })}
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