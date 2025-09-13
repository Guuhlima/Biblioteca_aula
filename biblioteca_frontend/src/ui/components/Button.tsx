import { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  loading?: boolean;
};

export function Button({ className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        "group relative w-full overflow-hidden rounded-lg bg-white/10 px-4 py-2 font-medium text-white backdrop-blur " +
        "border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition " +
        "hover:bg-white/15 active:scale-[0.99] disabled:opacity-50 " +
        className
      }
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-0" />
      <span className="relative">{props.children}</span>
    </button>
  );
}
