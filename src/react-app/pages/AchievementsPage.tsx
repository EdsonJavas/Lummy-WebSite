import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, RefreshCw, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { useSelectedChild } from "@/react-app/context/SelectedChildContext";
import {
  resolveAchievementsForChild,
  type CatalogAchievement,
  type LegacyAchievementRow,
  type UnlockedRow,
} from "@/react-app/services/engagement";
import { APP_BASE } from "@/react-app/lib/appRoutes";

const ORANGE = "#FF8C42";

function hexColor(hex?: string) {
  if (!hex) return ORANGE;
  return hex.startsWith("#") ? hex : `#${hex}`;
}

function achName(a: CatalogAchievement) {
  return a.name || a.title || "Conquista";
}

function AchievementCard({
  a,
  unlocked,
  unlock,
  isDark,
}: {
  a: CatalogAchievement;
  unlocked: boolean;
  unlock?: UnlockedRow;
  isDark: boolean;
}) {
  const cardBg = isDark
    ? "border-white/[0.08] bg-[#121826]/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
    : "border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]";

  const statusPill = unlocked
    ? isDark
      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
      : "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/25"
    : isDark
      ? "bg-white/10 text-gray-400 ring-1 ring-white/10"
      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200";

  return (
    <article
      className={`group rounded-2xl border p-4 sm:p-5 transition-all ${cardBg} ${
        isDark ? "hover:bg-white/[0.02]" : "hover:shadow-md"
      } ${!unlocked ? "opacity-90" : ""}`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14"
          style={{
            backgroundColor: `${hexColor(a.color_hex)}15`,
          }}
        >
          <span
            className={`text-2xl sm:text-[26px] leading-none ${
              unlocked ? "" : "grayscale"
            }`}
          >
            {a.emoji ?? "🏆"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
            <div className="min-w-0 flex-1">
              <h3
                className={`font-poppins text-base font-semibold leading-snug sm:text-lg ${
                  isDark ? "text-white" : "text-[#1E293B]"
                }`}
              >
                {achName(a)}
              </h3>
              <p
                className={`mt-1 font-poppins text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-gray-400" : "text-[#64748B]"
                }`}
              >
                {a.description}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusPill}`}
            >
              {unlocked ? "Desbloqueada" : "Bloqueada"}
            </span>
          </div>

          <div
            className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 font-poppins text-xs ${
              isDark
                ? "border-white/[0.06] text-gray-400"
                : "border-[#E2E8F0] text-[#64748B]"
            }`}
          >
            {a.points_required != null && (
              <span className="inline-flex items-center gap-1.5">
                <span className="font-medium">{a.points_required} pts</span>
                <span>para desbloquear</span>
              </span>
            )}
            {unlocked && unlock && (
              <span
                className="inline-flex items-center gap-1.5 font-medium"
                style={{ color: "#10B981" }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Desbloqueada em{" "}
                {new Date(unlock.unlocked_at).toLocaleDateString("pt-BR")}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function LegacyAchievementCard({
  r,
  isDark,
}: {
  r: LegacyAchievementRow;
  isDark: boolean;
}) {
  const cardBg = isDark
    ? "border-white/[0.08] bg-[#121826]/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
    : "border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]";

  return (
    <article
      className={`group rounded-2xl border p-4 sm:p-5 transition-all ${cardBg} ${
        isDark ? "hover:bg-white/[0.02]" : "hover:shadow-md"
      } ${!r.is_completed ? "opacity-90" : ""}`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14"
          style={{
            backgroundColor: `${ORANGE}15`,
          }}
        >
          <span
            className={`text-2xl sm:text-[26px] leading-none ${
              r.is_completed ? "" : "grayscale"
            }`}
          >
            {r.emoji}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-poppins text-base font-semibold leading-snug sm:text-lg ${
              isDark ? "text-white" : "text-[#1E293B]"
            }`}
          >
            {r.title}
          </h3>
          <p
            className={`mt-1 font-poppins text-xs sm:text-sm leading-relaxed ${
              isDark ? "text-gray-400" : "text-[#64748B]"
            }`}
          >
            {r.description}
          </p>
          {r.completed_date && (
            <div
              className={`mt-3 inline-flex items-center gap-1.5 border-t pt-3 font-poppins text-xs font-medium ${
                isDark
                  ? "border-white/[0.06] text-emerald-400"
                  : "border-[#E2E8F0] text-emerald-700"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {new Date(r.completed_date).toLocaleDateString("pt-BR")}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function AchievementsPage() {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const { selectedChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<
    | { mode: "catalog"; catalog: CatalogAchievement[]; unlocks: UnlockedRow[] }
    | { mode: "legacy"; rows: LegacyAchievementRow[] }
    | null
  >(null);

  const childId = selectedChild?.id;

  const load = useCallback(async () => {
    if (!childId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const r = await resolveAchievementsForChild(childId);
      setData(r);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!profile) return null;

  if (profile.role === "parent" && profile.children.length === 0) {
    return (
      <p className={isDark ? "text-gray-400" : "text-gray-600"}>
        Cadastre dependentes pelo app para ver conquistas.
      </p>
    );
  }

  const unlockedSet =
    data?.mode === "catalog"
      ? new Set(data.unlocks.map((u) => u.achievement_id))
      : null;

  return (
    <div className="w-full max-w-none space-y-6 pb-8">
      <section
        className={`relative overflow-hidden rounded-3xl border p-5 sm:p-7 ${
          isDark
            ? "border-white/[0.08] bg-[#121826]"
            : "border-[#E2E8F0] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
        }`}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#FF8C42]/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[#4A90E2]/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isDark
                  ? "bg-[#FF8C42]/15 text-[#FFB88C] ring-1 ring-[#FF8C42]/25"
                  : "bg-[#FF8C42]/10 text-[#FF8C42] ring-1 ring-[#FF8C42]/20"
              }`}
            >
              <Trophy className="h-3 w-3" />
              Conquistas Lummy
            </span>
            <h1 className="mt-3 font-poppins text-2xl font-bold tracking-tight text-[#FF8C42] sm:text-3xl md:text-4xl">
              Badges e progresso
            </h1>
            <p
              className={`mt-2 max-w-xl font-poppins text-sm leading-relaxed ${
                isDark ? "text-gray-400" : "text-[#64748B]"
              }`}
            >
              Mesmo visual do app: acompanhe conquistas desbloqueadas e
              disponíveis. Desbloquear conquistas continua no aplicativo.
            </p>
            {selectedChild ? (
              <p
                className={`mt-2 text-sm font-medium ${
                  isDark ? "text-gray-300" : "text-[#1E293B]"
                }`}
              >
                Dependente:{" "}
                <span className="text-[#FF8C42]">{selectedChild.name}</span>
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void load()}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isDark
                  ? "bg-white/[0.08] text-white ring-1 ring-white/10 hover:bg-white/[0.12]"
                  : "bg-[#1E293B] text-white shadow-md hover:bg-[#0f172a]"
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </button>
            <Link
              to={APP_BASE}
              className="inline-flex items-center rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors border-[#FF8C42]/40 text-[#FF8C42] hover:bg-[#FF8C42]/10"
            >
              ← Painel
            </Link>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#FF8C42] border-t-transparent" />
        </div>
      ) : !data ? (
        <div
          className={`rounded-2xl border px-6 py-16 text-center font-poppins ${
            isDark
              ? "border-white/[0.08] bg-[#121826]/50 text-gray-500"
              : "border-[#E2E8F0] bg-white text-[#64748B]"
          }`}
        >
          <p className="text-sm font-medium">Selecione um dependente.</p>
        </div>
      ) : data.mode === "legacy" ? (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border p-4 sm:p-5 ${
              isDark
                ? "border-white/[0.08] bg-[#121826]/60"
                : "border-[#E2E8F0] bg-[#F8FAFC]"
            }`}
          >
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-gray-500" : "text-[#64748B]"
                }`}
              >
                Concluídas
              </p>
              <p className="mt-1 font-poppins text-2xl font-bold tabular-nums text-[#10B981] sm:text-3xl">
                {data.rows.filter((r) => r.is_completed).length}
              </p>
            </div>
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-gray-500" : "text-[#64748B]"
                }`}
              >
                Em aberto
              </p>
              <p className="mt-1 font-poppins text-2xl font-bold tabular-nums text-[#FF8C42] sm:text-3xl">
                {data.rows.filter((r) => !r.is_completed).length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.rows.map((r) => (
              <LegacyAchievementCard key={r.id} r={r} isDark={isDark} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border p-4 sm:p-5 ${
              isDark
                ? "border-white/[0.08] bg-[#121826]/60"
                : "border-[#E2E8F0] bg-[#F8FAFC]"
            }`}
          >
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-gray-500" : "text-[#64748B]"
                }`}
              >
                Desbloqueadas
              </p>
              <p className="mt-1 font-poppins text-2xl font-bold tabular-nums text-[#10B981] sm:text-3xl">
                {data.unlocks.length}
              </p>
            </div>
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-gray-500" : "text-[#64748B]"
                }`}
              >
                No catálogo
              </p>
              <p className="mt-1 font-poppins text-2xl font-bold tabular-nums text-[#4A90E2] sm:text-3xl">
                {data.catalog.length}
              </p>
            </div>
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? "text-gray-500" : "text-[#64748B]"
                }`}
              >
                Faltam
              </p>
              <p className="mt-1 font-poppins text-2xl font-bold tabular-nums text-[#FF66B3] sm:text-3xl">
                {Math.max(0, data.catalog.length - data.unlocks.length)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.catalog.map((a) => {
              const id = a.id;
              const unlocked = unlockedSet?.has(id) ?? false;
              const unlock = data.unlocks.find((u) => u.achievement_id === id);
              return (
                <AchievementCard
                  key={id}
                  a={a}
                  unlocked={unlocked}
                  unlock={unlock}
                  isDark={isDark}
                />
              );
            })}
          </div>

          {data.catalog.length === 0 && (
            <div
              className={`rounded-2xl border px-6 py-16 text-center font-poppins ${
                isDark
                  ? "border-white/[0.08] bg-[#121826]/50 text-gray-500"
                  : "border-[#E2E8F0] bg-white text-[#64748B]"
              }`}
            >
              <p className="text-sm font-medium">
                Catálogo vazio ou indisponível neste projeto.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
