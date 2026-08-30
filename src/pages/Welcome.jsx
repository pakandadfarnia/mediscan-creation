import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "@/lib/LanguageProvider";
import { Pill, LogIn, UserPlus, ShieldCheck, Camera } from "lucide-react";

// First-run title screen. Shown to unauthenticated users: a clean brand
// splash with two primary actions — sign in, or create an account (which
// leads into the email register flow, then the mandatory profile setup).
export default function Welcome() {
  const { t } = useLang();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-12">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-stone-900 text-white shadow-lg">
            <Pill className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-heading text-4xl font-semibold tracking-tight text-stone-900">
            MediScan
          </h1>
          <p className="mt-3 text-base text-stone-500">
            {t("welcome.tagline")}
          </p>

          <div className="mt-8 grid w-full gap-3 text-left">
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <Camera className="mt-0.5 h-5 w-5 shrink-0 text-stone-500" />
              <div>
                <p className="text-sm font-medium text-stone-800">{t("welcome.feat1Title")}</p>
                <p className="text-xs text-stone-500">{t("welcome.feat1Desc")}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-stone-500" />
              <div>
                <p className="text-sm font-medium text-stone-800">{t("welcome.feat2Title")}</p>
                <p className="text-xs text-stone-500">{t("welcome.feat2Desc")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Link
            to="/register"
            className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <UserPlus className="h-4 w-4" />
            {t("welcome.createAccount")}
          </Link>
          <Link
            to="/login"
            className="flex h-13 w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-3.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            <LogIn className="h-4 w-4" />
            {t("welcome.signIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}