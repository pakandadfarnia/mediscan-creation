import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Medication, Allergy, Alarm } from "@/lib/localDb";
import { Input } from "@/components/ui/input";
import { Search, Pill, Loader2 } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";
import LibraryCard from "@/components/med/LibraryCard";
import InteractionModal from "@/components/med/InteractionModal";
import ConfirmDeleteDialog from "@/components/med/ConfirmDeleteDialog";
import { useMember } from "@/lib/MemberContext";
import { useInteractionCheck } from "@/lib/useInteractionCheck";

// Library page: lists every saved medication as cards with inline allergy and
// interaction warnings. Translates all medication info (including stored
// interaction descriptions) into the user's preferred language on load and
// whenever the language changes.
export default function Library() {
  const { t, lang } = useLang();
  const { activeMember } = useMember();
  const [confirmId, setConfirmId] = useState(null); // medication awaiting delete confirmation
  const [meds, setMeds] = useState(null);          // raw records from the DB
  const [displayMeds, setDisplayMeds] = useState(null); // translated records for rendering
  const [translating, setTranslating] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [alarms, setAlarms] = useState([]);         // reminder alarms for the active profile
  const [q, setQ] = useState("");                  // search query
  const [filter, setFilter] = useState("all");    // category filter
  // OTC ↔ prescription interaction check for the saved library. Existing pairs
  // on load are recorded as seen (no modal), so only persistent tags show;
  // tapping a tag re-opens the full warning modal.
  const { flags: interactionFlags, activeModal, acknowledge, reopen } = useInteractionCheck(displayMeds || [], { enabled: !!displayMeds });

  // Load the saved medications and allergies from the local DB.
  const load = async () => {
    if (!activeMember) return;
    setMeds(await Medication.filter({ profile_id: activeMember.id }, "-created_date"));
    setAllergies(await Allergy.filter({ profile_id: activeMember.id }));
    setAlarms(await Alarm.filter({ profile_id: activeMember.id }));
  };
  useEffect(() => { load(); }, [activeMember?.id]);

  // Delete a medication (after confirmation) and refresh the list.
  const remove = async (id) => { await Medication.delete(id); setConfirmId(null); load(); };

  // Translate the library's medication info into the user's preferred language
  // so side effects, warnings, purpose, frequency, etc. show translated inline.
  // Shows the original records immediately, then swaps in the translated ones.
  useEffect(() => {
    if (!meds) return;
    setDisplayMeds(meds);
    if (lang === "en") return;
    let cancelled = false;
    setTranslating(true);
    Promise.all(meds.map(async (m) => {
      try {
        const res = await base44.functions.invoke("translateMedication", { medication: m, language: lang });
        const data = res.data?.result;
        return data ? { ...m, ...data } : m;
      } catch { return m; }
    })).then((translated) => {
      if (!cancelled) setDisplayMeds(translated);
    }).finally(() => { if (!cancelled) setTranslating(false); });
    return () => { cancelled = true; };
  }, [meds, lang]);

  const FILTERS = [
    { value: "all", label: t("library.filterAll") },
    { value: "prescription", label: t("library.filterRx") },
    { value: "otc", label: t("library.filterOtc") },
    { value: "supplement", label: t("library.filterSupp") },
  ];

  // Apply the search query + category filter to the (translated) records.
  const filtered = (displayMeds || []).filter((m) => {
    const matchesText = `${m.name} ${m.generic_name || ""}`.toLowerCase().includes(q.toLowerCase());
    const matchesCat = filter === "all" || (m.category || "prescription") === filter;
    return matchesText && matchesCat;
  });

  // Count records per category for the filter badges.
  const counts = (displayMeds || []).reduce((acc, m) => {
    const c = m.category || "prescription";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("library.title")}</h1>
      <p className="mt-1 text-sm text-stone-500">{t("library.desc")}</p>
      {translating && (
        <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("detail.translating")}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f.value ? "bg-primary text-white" : "border border-stone-200 text-stone-600 hover:bg-stone-100"
            }`}
          >
            {f.label}{f.value !== "all" && counts[f.value] ? ` ${counts[f.value]}` : ""}
          </button>
        ))}
      </div>

      <div className="relative mt-4">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("library.search")}
          className="h-12 rounded-full border-stone-200 bg-white pl-11"
        />
      </div>

      {meds === null && <p className="mt-10 text-sm text-stone-400">{t("common.loading")}</p>}

      {meds !== null && filtered.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <Pill className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-4 text-sm text-stone-500">{t("library.empty")}</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm text-white">
            {t("library.scanNow")}
          </Link>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((m) => (
            <LibraryCard
              key={m.id}
              med={m}
              allergies={allergies}
              onRemove={setConfirmId}
              interactionFlags={interactionFlags}
              onInteractionTagClick={reopen}
              alarms={alarms.filter((a) => a.medication_id === m.id)}
              onAlarmsChange={load}
              profileId={activeMember?.id}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!confirmId}
        onConfirm={() => confirmId && remove(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
      <InteractionModal flag={activeModal} onAcknowledge={acknowledge} />
    </div>
  );
}