import React, { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`glass-input rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all ${className}`}
          {...rest}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
