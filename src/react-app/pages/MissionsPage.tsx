import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Target, Sparkles } from "lucide-react";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { useSelectedChild } from "@/react-app/context/SelectedChildContext";
import {
  type DailyMissionRow,
  fetchMissionsDateRange,
  fetchRecentCompletedMissions,
  fetchTodayMissions,
} from "@/react-app/services/engagement";
import { localDateKey } from "@/react-app/lib/dateUtils";
import { APP_BASE } from "@/react-app/lib/appRoutes";

const BLUE = "#4A90E2";

function hexColor(hex: string) {
  return hex.startsWith("#") ? hex : `#${hex}`;
}

function MissionCard({
  row,
  isDark,
}: {
  row: DailyMissionRow;
  isDark: boolean;
}) {
  const m = row.mission;
  const title = m?.title ?? "Missão";
  const emoji = m?.emoji ?? "⭐";
  const color = m?.color_hex ? hexColor(m.color_hex) : BLUE;
  const done = row.is_completed;

  const cardBg = isDark
    ? "border-white/[0.08] bg-[#121826]/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
    : "border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]";

  const statusPill = done
    ? isDark
      ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
      : "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/25"
    : isDark
      ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30"
      : "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/25";

  return (
    <article
      className={`group rounded-2xl border p-4 sm:p-5 transition-all ${cardBg} ${
        isDark ? "hover:bg-white/[0.02]" : "hover:shadow-md"
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14"
          style={{
            backgroundColor: `${color}15`,
          }}
        >
          <span className="text-2xl sm:text-[26px] leading-none">{emoji}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
            <div className="min-w-0 flex-1">
              <h3
                className={`font-poppins text-base font-semibold leading-snug sm:text-lg ${
                  isDark ? "text-white" : "text-[#1E293B]"
                }`}
              >
                {title}
              </h3>
              <p
                className={`mt-1 font-poppins text-xs sm:text-sm leading-relaxed ${
                  isDark ? "text-gray-400" : "text-[#64748B]"
                }`}
              >
                {m?.description ?? "—"}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${statusPill}`}
            >
              {done ? "Concluída" : "Pendente"}
            </span>
          </div>

          <div
            className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 font-poppins text-xs ${
              isDark
                ? "border-white/[0.06] text-gray-400"
                : "border-[#E2E8F0] text-[#64748B]"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="font-medium">Progresso:</span>
              {row.progress}/{m?.progress_target ?? 1}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" style={{ color: BLUE }} />
              <span className="font-medium">{m?.points ?? 0} pontos</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="font-medium">Data:</span>
              {row.selected_date}
            </span>
            {row.points_earned != null && row.points_earned > 0 && (
              <span
                className="inline-flex items-center gap-1.5 font-semibold"
                style={{ color: "#10B981" }}
              >
                +{row.points_earned} pts
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

type TabKey = "today" | "week" | "done";

export default function MissionsPage() {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const { selectedChild } = useSelectedChild();
  const [tab, setTab] = useState<TabKey>("today");
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState<DailyMissionRow[]>([]);
  const [week, setWeek] = useState<DailyMissionRow[]>([]);
  const [done, setDone] = useState<DailyMissionRow[]>([]);

  const childId = selectedChild?.id;

  const load = useCallback(async () => {
    if (!childId) {
      setLoading(false);
      setToday([]);
      setWeek([]);
      setDone([]);
      return;
    }
    setLoading(true);
    try {
      const [t, w, d] = await Promise.all([
        fetchTodayMissions(childId),
        fetchMissionsDateRange(childId, 7),
        fetchRecentCompletedMissions(childId, 50),
      ]);
      setToday(t);
      setWeek(w);
      setDone(d);
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
        Cadastre dependentes pelo app para ver missões.
      </p>
    );
  }

  const todayDone = today.filter((x) => x.is_completed).length;
  const todayTotal = today.length;
  const weekPending = week.filter((x) => !x.is_completed).length;
  const weekDone = week.filter((x) => x.is_completed).length;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "today", label: `Hoje (${localDateKey()})` },
    { key: "week", label: "Últimos 7 dias" },
    { key: "done", label: "Concluídas (recentes)" },
  ];

  let list: DailyMissionRow[] = [];
  if (tab === "today") list = today;
  else if (tab === "week") list = week;
  else list = done;

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
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#4A90E2]/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-[#FF8C42]/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isDark
                  ? "bg-[#4A90E2]/15 text-[#93C5FD] ring-1 ring-[#4A90E2]/25"
                  : "bg-[#4A90E2]/10 text-[#2563EB] ring-1 ring-[#4A90E2]/20"
              }`}
            >
              <Target className="h-3 w-3" />
              Missões Lummy
            </span>
            <h1 className="mt-3 font-poppins text-2xl font-bold tracking-tight text-[#4A90E2] sm:text-3xl md:text-4xl">
              Missões diárias
            </h1>
            <p
              className={`mt-2 max-w-xl font-poppins text-sm leading-relaxed ${
                isDark ? "text-gray-400" : "text-[#64748B]"
              }`}
            >
              Mesmo visual do app: acompanhe missões do dia, semana e histórico.
              Concluir ou criar missões continua no aplicativo.
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
              className="inline-flex items-center rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors border-[#4A90E2]/40 text-[#4A90E2] hover:bg-[#4A90E2]/10"
            >
              ← Painel
            </Link>
          </div>
        </div>
      </section>

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
            Hoje
          </p>
          <p className="mt-1 font-poppins text-2xl font-bold tabular-nums text-[#FF8C42] sm:text-3xl">
            {todayDone}/{todayTotal || "—"}
          </p>
          <p
            className={`mt-1 text-xs font-poppins ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            concluídas / disponíveis
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            7 dias
          </p>
          <p className="mt-1 font-poppins text-2xl font-bold tabular-nums text-[#10B981] sm:text-3xl">
            {weekDone}
          </p>
          <p
            className={`mt-1 text-xs font-poppins ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            concluídas · {weekPending} pendentes
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            Arquivo
          </p>
          <p className="mt-1 font-poppins text-2xl font-bold tabular-nums text-[#FF66B3] sm:text-3xl">
            {done.length}
          </p>
          <p
            className={`mt-1 text-xs font-poppins ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            últimas concluídas
          </p>
        </div>
      </div>

      <div
        className={`flex flex-wrap gap-2 rounded-2xl border p-3 sm:p-4 ${
          isDark
            ? "border-white/[0.08] bg-[#121826]/60"
            : "border-[#E2E8F0] bg-[#F8FAFC]"
        }`}
      >
        <span
          className={`mr-1 flex w-full items-center text-[10px] font-bold uppercase tracking-wider sm:mr-2 sm:w-auto ${
            isDark ? "text-gray-500" : "text-[#64748B]"
          }`}
        >
          Visualizar
        </span>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-xl px-3.5 py-2 font-poppins text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-[#4A90E2] text-white shadow-md shadow-[#4A90E2]/25"
                : isDark
                  ? "bg-white/[0.06] text-gray-300 ring-1 ring-white/10 hover:bg-white/[0.1]"
                  : "bg-white text-[#64748B] ring-1 ring-[#E2E8F0] hover:bg-[#F1F5F9]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#4A90E2] border-t-transparent" />
        </div>
      ) : list.length === 0 ? (
        <div
          className={`rounded-2xl border px-6 py-16 text-center font-poppins ${
            isDark
              ? "border-white/[0.08] bg-[#121826]/50 text-gray-500"
              : "border-[#E2E8F0] bg-white text-[#64748B]"
          }`}
        >
          <p className="text-sm font-medium">Nenhuma missão nesta visão.</p>
          <p className="mt-1 text-xs opacity-80">
            Troque a aba ou aguarde novas missões.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((row) => (
            <MissionCard key={row.id} row={row} isDark={isDark} />
          ))}
        </div>
      )}
    </div>
  );
}
