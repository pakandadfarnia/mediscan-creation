import React from "react";

// Avatar colors cycle through this palette based on the member's `color` index.
const COLORS = ["bg-teal-600", "bg-indigo-500", "bg-amber-500", "bg-rose-500", "bg-emerald-600", "bg-sky-600"];

// A member's initials on a colored circle. Used by the profile switcher and
// the household profiles page.
export default function MemberAvatar({ member, className = "h-8 w-8 text-xs" }) {
  const name = (member?.name || "?").trim();
  const initials = name.split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
  const color = COLORS[(member?.color ?? 0) % COLORS.length];
  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${color} ${className}`}>
      {initials}
    </div>
  );
}