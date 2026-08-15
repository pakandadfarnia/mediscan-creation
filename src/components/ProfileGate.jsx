import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProfileGate } from "@/lib/ProfileContext";

// Forces first-time users to create a profile before they can use the app.
// If no profile exists yet, every route except /profile redirects there.
export default function ProfileGate() {
  const { ready, hasProfile } = useProfileGate();
  const { pathname } = useLocation();

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
      </div>
    );
  }
  if (!hasProfile && pathname !== "/profile") {
    return <Navigate to="/profile" replace />;
  }
  return <Outlet />;
}