import { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  loading?: boolean;
};

export function Button({
  loading = false,
  className = "",
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      className={`px-4 py-2 rounded-lg bg-base-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading || disabled}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
