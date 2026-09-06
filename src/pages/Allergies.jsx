import React, { useEffect, useState } from "react";
import { Allergy } from "@/lib/localDb";
import { ShieldAlert, Trash2 } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";
import AllergyEntryForm from "@/components/med/AllergyEntryForm";
import ConfirmDeleteDialog from "@/components/med/ConfirmDeleteDialog";
import { useMember } from "@/lib/MemberContext";

// Tailwind classes for each allergy severity badge.
const SEV_STYLE = {
  mild: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  severe: "bg-red-100 text-red-700",
};

// Allergies page: lets the user record the food/chemical ingredients they're
// allergic to (with reaction + severity). Every scanned medication is cross-
// checked against this list.
export default function Allergies() {
  const { t } = useLang();
  const { activeMember } = useMember();
  const [list, setList] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  // Load the active profile's allergies from the local DB.
  const load = async () => {
    if (!activeMember) return;
    setList(await Allergy.filter({ profile_id: activeMember.id }));
  };
  useEffect(() => { load(); }, [activeMember?.id]);

  // Delete an allergy (after confirmation) and refresh the list.
  const remove = async (id) => { await Allergy.delete(id); setConfirmId(null); load(); };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("allergies.title")}</h1>
      <p className="mt-1 text-sm text-stone-500">{t("allergies.desc")}</p>

      <div className="mt-6">
        <AllergyEntryForm onAdded={load} profileId={activeMember?.id} />
      </div>

      {list === null && <p className="mt-8 text-sm text-stone-400">{t("common.loading")}</p>}

      {list !== null && list.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-4 text-sm text-stone-500">{t("allergies.empty")}</p>
        </div>
      )}

      {list && list.length > 0 && (
        <div className="mt-6 space-y-2">
          {list.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-stone-800">{a.name}</span>
                  {a.severity && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEV_STYLE[a.severity] || "bg-stone-100 text-stone-600"}`}>
                      {t(`allergies.sev${a.severity.charAt(0).toUpperCase()}${a.severity.slice(1)}`)}
                    </span>
                  )}
                </div>
                {a.reaction && (
                  <p className="mt-0.5 text-sm text-stone-500">
                    <span className="font-medium text-stone-400">{t("allergies.reaction")}:</span> {a.reaction}
                  </p>
                )}
              </div>
              <button onClick={() => setConfirmId(a.id)} className="shrink-0 rounded-full p-1 text-stone-300 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!confirmId}
        onConfirm={() => confirmId && remove(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}