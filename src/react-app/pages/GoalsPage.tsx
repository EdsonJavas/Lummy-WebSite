import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Flag, RefreshCw } from "lucide-react";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { useSelectedChild } from "@/react-app/context/SelectedChildContext";
import {
  fetchGoalsForChild,
  type GoalRowFull,
} from "@/react-app/services/engagement";
import { APP_BASE } from "@/react-app/lib/appRoutes";
import {
  goalRowIsCancelled,
  goalRowIsCompleted,
  goalRowIsInProgress,
  goalRowStatusLabel,
} from "@/react-app/lib/goalStatus";

/** Alinhado a `AppConstants` do app Flutter */
const BLUE = "#4A90E2";
const BLUE_DEEP = "#1E40AF";
const TEXT_SECONDARY = "#64748B";
const SUCCESS = "#10B981";

function brl(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

type Filter = "all" | "active" | "completed" | "cancelled";

function GoalCard({
  g,
  isDark,
}: {
  g: GoalRowFull;
  isDark: boolean;
}) {
  const pct =
    g.target_amount > 0
      ? Math.min(100, (g.current_amount / g.target_amount) * 100)
      : 0;
  const remaining = Math.max(0, g.target_amount - g.current_amount);
  const statusLabel = goalRowStatusLabel(g);
  const done = goalRowIsCompleted(g);
  const cancelled = goalRowIsCancelled(g);

  const textMain = isDark ? "text-white" : "text-[#1E293B]";
  const textSub = isDark ? "text-gray-400" : "text-[#64748B]";
  const cardBg = isDark
    ? "border-white/[0.08] bg-[#121826]/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
    : "border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]";

  const barTrack = isDark ? "bg-white/10" : "bg-[#E2E8F0]";

  const statusPill =
    done
      ? isDark
        ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
        : "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/25"
      : cancelled
        ? isDark
          ? "bg-white/10 text-gray-400 ring-1 ring-white/10"
          : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
        : isDark
          ? "bg-[#4A90E2]/20 text-[#93C5FD] ring-1 ring-[#4A90E2]/35"
          : "bg-[#4A90E2]/10 text-[#2563EB] ring-1 ring-[#4A90E2]/25";

  return (
    <li
      className={`rounded-2xl border p-4 sm:p-5 ${cardBg}`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${
            isDark ? "bg-[#4A90E2]/15" : "bg-[#4A90E2]/10"
          }`}
        >
          <span className="text-2xl sm:text-[26px] leading-none">{g.emoji}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className={`font-poppins text-base font-semibold leading-snug sm:text-lg ${textMain}`}
                >
                  {g.name}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusPill}`}
                >
                  {statusLabel}
                </span>
              </div>
              <p className={`mt-0.5 font-poppins text-xs sm:text-sm ${textSub}`}>
                Meta de economia
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className="font-poppins text-lg font-bold tabular-nums sm:text-xl"
                style={{ color: done ? SUCCESS : cancelled ? (isDark ? "#94a3b8" : TEXT_SECONDARY) : BLUE }}
              >
                {pct.toFixed(0)}%
              </p>
              <p className={`text-[10px] font-medium uppercase tracking-wide ${textSub}`}>
                progresso
              </p>
            </div>
          </div>

          {g.description ? (
            <p className={`mt-3 text-sm leading-relaxed ${textSub}`}>
              {g.description}
            </p>
          ) : null}

          <div className={`mt-4 h-2 overflow-hidden rounded ${barTrack}`}>
            <div
              className="h-full rounded transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: done
                  ? `linear-gradient(90deg, ${SUCCESS}, #34D399)`
                  : cancelled
                    ? isDark
                      ? "#475569"
                      : "#CBD5E1"
                    : `linear-gradient(90deg, ${BLUE}, ${BLUE_DEEP})`,
              }}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className={`font-poppins text-xs ${textSub}`}>Economizado</p>
              <p className={`mt-0.5 font-poppins text-sm font-semibold tabular-nums sm:text-base ${textMain}`}>
                {brl(g.current_amount)}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-poppins text-xs ${textSub}`}>
                {done ? "Objetivo" : "Falta"}
              </p>
              <p
                className="mt-0.5 font-poppins text-sm font-semibold tabular-nums sm:text-base"
                style={{
                  color: done
                    ? SUCCESS
                    : cancelled
                      ? isDark
                        ? "#94a3b8"
                        : TEXT_SECONDARY
                      : BLUE,
                }}
              >
                {done ? brl(g.target_amount) : brl(remaining)}
              </p>
            </div>
          </div>

          <div
            className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 font-poppins text-xs ${textSub} ${
              isDark ? "border-white/[0.06]" : "border-[#E2E8F0]"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 shrink-0 opacity-70" style={{ color: BLUE }} />
              Objetivo {brl(g.target_amount)}
            </span>
            {g.deadline ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 ${
                  isDark ? "bg-[#4A90E2]/12" : "bg-[#4A90E2]/08"
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5 shrink-0" style={{ color: BLUE }} />
                <span style={{ color: BLUE }} className="font-medium">
                  Prazo {new Date(g.deadline).toLocaleDateString("pt-BR")}
                </span>
              </span>
            ) : null}
            {g.completed_at && done ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                Concluída em{" "}
                {new Date(g.completed_at).toLocaleDateString("pt-BR")}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function GoalsPage() {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const { selectedChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<GoalRowFull[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  const childId = selectedChild?.id;

  const load = useCallback(async () => {
    if (!childId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const g = await fetchGoalsForChild(childId);
      setRows(g);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "active")
      return rows.filter((r) => goalRowIsInProgress(r));
    if (filter === "completed")
      return rows.filter((r) => goalRowIsCompleted(r));
    return rows.filter((r) => goalRowIsCancelled(r));
  }, [rows, filter]);

  const stats = useMemo(() => {
    const inProgress = rows.filter((r) => goalRowIsInProgress(r)).length;
    const completed = rows.filter((r) => goalRowIsCompleted(r)).length;
    const cancelled = rows.filter((r) => goalRowIsCancelled(r)).length;
    return { inProgress, completed, cancelled, total: rows.length };
  }, [rows]);

  if (!profile) return null;

  if (profile.role === "parent" && profile.children.length === 0) {
    return (
      <p className={isDark ? "text-gray-400" : "text-gray-600"}>
        Cadastre dependentes pelo app para ver metas.
      </p>
    );
  }

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: `Todas (${stats.total})` },
    { key: "active", label: `Em andamento (${stats.inProgress})` },
    { key: "completed", label: `Concluídas (${stats.completed})` },
    { key: "cancelled", label: `Canceladas (${stats.cancelled})` },
  ];

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
                  ? "bg-[#10B981]/15 text-emerald-400 ring-1 ring-emerald-500/25"
                  : "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20"
              }`}
            >
              <Flag className="h-3 w-3" />
              Metas Lummy
            </span>
            <h1 className="mt-3 font-poppins text-2xl font-bold tracking-tight text-[#10B981] sm:text-3xl md:text-4xl">
              Metas de economia
            </h1>
            <p
              className={`mt-2 max-w-xl font-poppins text-sm leading-relaxed ${
                isDark ? "text-gray-400" : "text-[#64748B]"
              }`}
            >
              Mesmo visual do app: progresso em azul, economizado e falta. Criar
              ou editar metas continua no aplicativo.
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
          Filtrar
        </span>
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-xl px-3.5 py-2 font-poppins text-sm font-semibold transition-all ${
              filter === f.key
                ? "bg-[#4A90E2] text-white shadow-md shadow-[#4A90E2]/25"
                : isDark
                  ? "bg-white/[0.06] text-gray-300 ring-1 ring-white/10 hover:bg-white/[0.1]"
                  : "bg-white text-[#64748B] ring-1 ring-[#E2E8F0] hover:bg-[#F1F5F9]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#4A90E2] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className={`rounded-2xl border px-6 py-16 text-center font-poppins ${
            isDark
              ? "border-white/[0.08] bg-[#121826]/50 text-gray-500"
              : "border-[#E2E8F0] bg-white text-[#64748B]"
          }`}
        >
          <p className="text-sm font-medium">Nenhuma meta neste filtro.</p>
          <p className="mt-1 text-xs opacity-80">
            Troque o filtro ou cadastre metas pelo app.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((g) => (
            <GoalCard key={g.id} g={g} isDark={isDark} />
          ))}
        </ul>
      )}
    </div>
  );
}
