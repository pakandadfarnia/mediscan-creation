import React from "react";
import { AlertOctagon } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

// Red stop-sign warning shown when the user has an allergy to a medication
// itself or to one of its components. Renders the stop-sign icon together
// with the standardized "do not take without consulting a physician" notice.
export default function AllergyStopWarning() {
  const { t } = useLang();
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-800">
      <AlertOctagon className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
      <span>{t("safety.allergyMedWarning")}</span>
    </div>
  );
}