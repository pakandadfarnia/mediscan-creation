import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ScanLine, Library, ShieldAlert, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";

const NAV = [
  { to: "/", label: "Scan", icon: ScanLine },
  { to: "/library", label: "Library", icon: Library },
  { to: "/allergies", label: "Allergies", icon: ShieldAlert },
];

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-stone-50 font-body text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Med<span className="text-emerald-600">Lens</span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                  pathname === to ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-200/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            <button
              onClick={() => base44.auth.logout()}
              className="ml-1 rounded-full p-2 text-stone-400 transition-colors hover:text-stone-700"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-8">
        <Outlet />
      </main>
      <footer className="pb-8 text-center text-xs text-stone-400">
        Informational only — always follow your doctor or pharmacist's instructions.
      </footer>
    </div>
  );
}