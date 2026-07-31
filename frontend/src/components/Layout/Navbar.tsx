import React, { useState } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const Navbar = ({ title }: { title: string }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-navy-900/50 backdrop-blur-xl px-6 py-4">
      <h1 className="font-display text-xl font-semibold text-slate-100">{title}</h1>

      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-800/60 px-3 py-2 text-sm text-slate-200 hover:bg-navy-700 transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/20 text-teal-300">
            <User size={14} />
          </div>
          <span className="hidden sm:block max-w-[120px] truncate">{user?.name}</span>
          <ChevronDown size={14} className="text-slate-500" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="glass absolute right-0 z-20 mt-2 w-52 rounded-xl p-2 animate-fadeIn">
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-sm text-slate-200 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <span className="mt-1 inline-block text-[10px] uppercase tracking-wide text-teal-400">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
