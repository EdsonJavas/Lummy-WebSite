import { Link } from "react-router-dom";
import { APP_BASE } from "@/react-app/lib/appRoutes";

type Props = {
  to?: string;
  isDark: boolean;
  className?: string;
  /** Texto após a marca (depois do “y”), mesma linha, alinhado à base (ex.: Painel). */
  trailingLabel?: string;
};

/** Marca Lummy compacta para a navbar. */
export default function LummyNavLogo({
  to = APP_BASE,
  isDark,
  className = "",
  trailingLabel,
}: Props) {
  const labelCls = isDark ? "text-gray-500" : "text-slate-400";

  const mark = (
    <span
      className={`font-poppins text-2xl font-bold tracking-tight sm:text-3xl md:text-[2rem] md:leading-none ${className}`}
    >
      <span className={isDark ? "text-white" : "text-slate-800"}>L</span>
      <span className={isDark ? "text-white" : "text-slate-800"}>u</span>
      <span className="text-[#4A90E2]">m</span>
      <span className="text-[#FF8C42]">m</span>
      <span className={isDark ? "text-white" : "text-slate-800"}>y</span>
    </span>
  );

  const linkBase =
    "select-none outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2]/50 focus-visible:ring-offset-2 rounded-md dark:focus-visible:ring-offset-[#0f1419]";
  const rowCls = trailingLabel
    ? `${linkBase} inline-flex items-end gap-2 sm:gap-2.5`
    : linkBase;

  const label = trailingLabel ? (
    <span
      className={`shrink-0 pb-[3px] text-[9px] font-bold uppercase leading-none tracking-[0.14em] sm:text-[10px] sm:pb-1 ${labelCls}`}
    >
      {trailingLabel}
    </span>
  ) : null;

  if (to) {
    return (
      <Link to={to} className={rowCls}>
        {mark}
        {label}
      </Link>
    );
  }

  return trailingLabel ? (
    <span className={`inline-flex items-end gap-2 sm:gap-2.5 ${className}`}>
      {mark}
      {label}
    </span>
  ) : (
    mark
  );
}
