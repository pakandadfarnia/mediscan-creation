import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ScanLine, Library, ShieldAlert, User, LogOut, AlarmClock, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useLang } from "@/lib/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import MemberSwitcher from "@/components/med/MemberSwitcher";
import AlarmCenter from "@/components/med/AlarmCenter";

// App shell: a sticky header with brand, navigation, language switcher,
// theme toggle and sign-out, plus the routed page content and a footer
// disclaimer. The active nav item is highlighted by matching the pathname.
export default function Layout() {
  const { t } = useLang();
  const { pathname } = useLocation();
  // Primary navigation entries (route, localized label, icon).
  const NAV = [
    { to: "/", label: t("nav.scan"), icon: ScanLine },
    { to: "/library", label: t("nav.library"), icon: Library },
    { to: "/allergies", label: t("nav.allergies"), icon: ShieldAlert },
    { to: "/alarms", label: t("nav.alarms"), icon: AlarmClock },
    { to: "/household", label: t("nav.household"), icon: Users },
    { to: "/profile", label: t("nav.profile"), icon: User },
  ];
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-y-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-semibold tracking-tight">
              Medi<span className="text-primary">Scan</span>
            </Link>
            <MemberSwitcher />
          </div>
          <div className="flex items-center gap-1">
            <nav className="flex items-center gap-1">
              {NAV.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-full px-2.5 py-2 text-sm transition-colors sm:px-4 ${
                    pathname === to ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              ))}
            </nav>
            <div className="ml-1 hidden sm:block">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
            <button
              onClick={() => base44.auth.logout()}
              className="ml-1 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={t("common.signOut")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-5 pb-3 sm:hidden">
          <LanguageSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-8">
        <Outlet />
      </main>
      {/* Alarm scheduler: checks active reminders and fires them app-wide. */}
      <AlarmCenter />
      <footer className="pb-8 text-center text-xs text-muted-foreground">{t("footer.disclaimer")}</footer>
    </div>
  );
}