import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Handshake,
  CheckSquare,
  Activity,
  Zap,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/deals", label: "Deals", icon: Handshake },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/activity", label: "Activity", icon: Activity },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/5 bg-navy-900/60 backdrop-blur-xl px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 shadow-glow">
          <Zap size={18} className="text-navy-950" strokeWidth={2.5} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight text-slate-100">
          Frext<span className="text-gradient">CRM</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-2 pt-6 text-xs text-slate-600 font-mono">
        v1.0.0 &middot; MERN + TS
      </div>
    </aside>
  );
};

export default Sidebar;
