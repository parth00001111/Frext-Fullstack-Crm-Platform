import React, { type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-teal-500 to-teal-600 text-navy-950 font-semibold hover:shadow-glow hover:from-teal-400 hover:to-teal-500",
  secondary:
    "bg-navy-700 text-slate-200 border border-white/10 hover:bg-navy-600",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5",
};

const Button = ({
  variant = "primary",
  loading = false,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
