import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { useSelectedChild } from "@/react-app/context/SelectedChildContext";
import LummyNavLogo from "@/react-app/components/LummyNavLogo";
import LummyDefaultAvatar from "@/react-app/components/LummyDefaultAvatar";

type Props = {
  isDark: boolean;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
};

export default function AppTopNav({
  isDark,
  onOpenMobileMenu,
  onLogout,
}: Props) {
  const { toggleTheme } = useTheme();
  const { profile, user } = useAuth();
  const { selectedChild } = useSelectedChild();

  const displayName =
    profile?.role === "parent"
      ? profile.parent.name
      : profile?.role === "child"
        ? profile.child.name
        : user?.email ?? "Conta";

  const roleLabel =
    profile?.role === "parent"
      ? "Responsável"
      : profile?.role === "child"
        ? "Dependente"
        : "Conta";

  const nChildren =
    profile?.role === "parent" ? profile.children.length : 0;
  const childrenHint =
    profile?.role === "parent"
      ? nChildren === 0
        ? "Nenhum dependente vinculado"
        : nChildren === 1
          ? "1 dependente vinculado"
          : `${nChildren} dependentes vinculados`
      : null;

  const tip = [displayName, user?.email].filter(Boolean).join(" · ");

  const iconBtn =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200";

  const titleCls = isDark ? "text-white" : "text-[#4A90E2]";
  const subCls = isDark ? "text-gray-500" : "text-slate-500";

  const rolePillCls = isDark
    ? "bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/35"
    : "bg-[#4A90E2]/12 text-[#2563eb] ring-1 ring-[#4A90E2]/25";

  const followingPillCls = isDark
    ? "bg-[#FF8C42]/18 text-[#FFB86B] ring-1 ring-[#FF8C42]/35"
    : "bg-[#FF8C42]/12 text-[#C2410C] ring-1 ring-[#FF8C42]/30";

  return (
    <header
      className={`flex shrink-0 items-center gap-2 border-b px-3 py-2 sm:gap-3 sm:px-5 ${
        isDark
          ? "border-white/[0.06] bg-[#0a0d12]/90 backdrop-blur-xl"
          : "border-slate-200/80 bg-white/85 backdrop-blur-xl"
      }`}
    >
      <button
        type="button"
        className={`${iconBtn} md:hidden ${
          isDark
            ? "text-slate-300 hover:bg-white/[0.06]"
            : "text-slate-600 hover:bg-slate-900/[0.05]"
        }`}
        aria-label="Abrir menu"
        onClick={onOpenMobileMenu}
      >
        <Menu className="h-5 w-5" strokeWidth={2} />
      </button>

      <div className="flex min-w-0 shrink-0 items-center">
        <LummyNavLogo isDark={isDark} trailingLabel="Painel" />
      </div>

      {/* Título + tag de papel | subtítulo | dependentes + badge acompanhando */}
      <div className="min-w-0 flex-1 px-1 text-left sm:px-2 md:text-right">
        <div className="flex min-w-0 flex-wrap items-center gap-2 md:justify-end">
          <p
            className={`min-w-0 truncate text-sm font-semibold leading-tight sm:text-[0.95rem] ${titleCls}`}
          >
            {displayName}
          </p>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${rolePillCls}`}
          >
            {roleLabel}
          </span>
        </div>
        <p className={`mt-px truncate text-xs leading-tight ${subCls}`}>
          {user?.email ?? "—"}
        </p>
        {profile?.role === "parent" && (
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2 md:justify-end">
            {childrenHint && (
              <span
                className={`truncate text-[10px] leading-tight sm:text-[11px] ${
                  isDark ? "text-gray-500" : "text-slate-500"
                }`}
              >
                {childrenHint}
              </span>
            )}
            {selectedChild && (
              <span
                className={`inline-flex max-w-full shrink-0 items-center truncate rounded-full px-2.5 py-0.5 text-[10px] font-semibold sm:text-[11px] ${followingPillCls}`}
              >
                Acompanhando {selectedChild.name}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <LummyDefaultAvatar size={44} title={tip} />
        <button
          type="button"
          onClick={toggleTheme}
          className={`${iconBtn} ${
            isDark
              ? "text-amber-400/95 hover:bg-white/[0.07]"
              : "text-amber-500 hover:bg-amber-500/[0.12]"
          }`}
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" strokeWidth={2} />
          ) : (
            <Moon className="h-[18px] w-[18px] text-slate-600" strokeWidth={2} />
          )}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className={`${iconBtn} ${
            isDark
              ? "text-[#F472B6] hover:bg-[#F472B6]/12"
              : "text-[#E11D48] hover:bg-rose-500/[0.1]"
          }`}
          aria-label="Sair da conta"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
