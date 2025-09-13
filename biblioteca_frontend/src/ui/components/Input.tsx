import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, ...props }: Props) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className={`mt-1 w-full rounded-lg border bg-white/5 px-3 py-2 text-white placeholder-white/40 outline-none 
            backdrop-blur transition focus:ring-2 focus:ring-indigo-400/40 focus:border-white/30 
            border-white/10 ${error ? "border-red-500/60 focus:ring-red-400/40" : ""}`}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
