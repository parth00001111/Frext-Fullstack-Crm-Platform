import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({ label = "Loading" }: { label?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
      <Loader2 size={28} className="animate-spin text-teal-400" />
      <span className="text-sm">{label}...</span>
    </div>
  );
};

export default Loader;
