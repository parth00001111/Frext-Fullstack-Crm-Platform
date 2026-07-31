import React from "react";

const colorMap: Record<string, string> = {
  Lead: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Qualified: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Proposal: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Won: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  Lost: "bg-red-500/15 text-red-300 border-red-500/30",
  Pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Completed: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  Active: "bg-teal-500/15 text-teal-300 border-teal-500/30",
  Inactive: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

const Badge = ({ label }: { label: string }) => {
  const classes = colorMap[label] || "bg-slate-500/15 text-slate-300 border-slate-500/30";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
};

export default Badge;
