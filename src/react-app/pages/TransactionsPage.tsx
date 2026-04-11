import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Receipt,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Search,
  CalendarDays,
} from "lucide-react";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { useSelectedChild } from "@/react-app/context/SelectedChildContext";
import {
  fetchTransactionsForChildren,
  type TxRow,
} from "@/react-app/services/dashboardData";
import { APP_BASE } from "@/react-app/lib/appRoutes";

function brl(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseTxDate(t: TxRow): Date {
  const raw = t.date || t.created_at;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
}

function groupLabelForKey(
  key: string,
  todayKey: string,
  yesterdayKey: string
): string {
  if (key === "unknown") return "Sem data";
  if (key === todayKey) return "Hoje";
  if (key === yesterdayKey) return "Ontem";
  const [y, m, day] = key.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  const label = d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function shortDayTitle(
  key: string,
  todayKey: string,
  yesterdayKey: string
): string {
  if (key === "unknown") return "Sem data";
  if (key === todayKey) return "Hoje";
  if (key === yesterdayKey) return "Ontem";
  const [y, m, day] = key.split("-").map(Number);
  const d = new Date(y, m - 1, day);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function typeLabel(type: string): string {
  if (type === "expense") return "Despesa";
  if (type === "income") return "Receita";
  return type;
}

function statusLabel(status: string): string {
  if (!status) return "—";
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    pending: "Pendente",
    approved: "Aprovada",
    rejected: "Recusada",
    completed: "Concluída",
    cancelled: "Cancelada",
  };
  return map[s] ?? status;
}

function dayTotals(items: TxRow[]) {
  let income = 0;
  let expense = 0;
  for (const r of items) {
    if (r.type === "income") income += r.amount;
    else if (r.type === "expense") expense += r.amount;
  }
  return { income, expense, net: income - expense, count: items.length };
}

const SELECT_LATEST = "";

type DayGroup = {
  key: string;
  label: string;
  shortTitle: string;
  items: TxRow[];
};

export default function TransactionsPage() {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const { selectedChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TxRow[]>([]);
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  /** vazio = sempre o dia mais recente dos filtrados; senão chave YYYY-MM-DD */
  const [selectedDayKey, setSelectedDayKey] = useState<string>(SELECT_LATEST);

  const childId = selectedChild?.id;

  const load = useCallback(async () => {
    if (!childId) {
      setRows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const t = await fetchTransactionsForChildren([childId], 200);
      setRows(t);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setSelectedDayKey(SELECT_LATEST);
  }, [typeFilter, statusFilter, search, childId, rows]);

  const statuses = useMemo(() => {
    const s = new Set(rows.map((r) => r.status).filter(Boolean));
    return ["all", ...Array.from(s)];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (q) {
        const hay = `${r.description} ${r.category} ${r.type} ${r.status}`
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, typeFilter, statusFilter, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => parseTxDate(b).getTime() - parseTxDate(a).getTime()
    );
  }, [filtered]);

  const todayKey = useMemo(() => localDateKey(new Date()), []);
  const yesterdayKey = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return localDateKey(d);
  }, []);

  const grouped = useMemo((): DayGroup[] => {
    const map = new Map<string, TxRow[]>();
    for (const t of sorted) {
      const d = parseTxDate(t);
      const key = d.getTime() === 0 ? "unknown" : localDateKey(d);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    const keys = Array.from(map.keys()).sort((a, b) => {
      if (a === "unknown") return 1;
      if (b === "unknown") return -1;
      return b.localeCompare(a);
    });
    return keys.map((key) => ({
      key,
      label: groupLabelForKey(key, todayKey, yesterdayKey),
      shortTitle: shortDayTitle(key, todayKey, yesterdayKey),
      items: map.get(key)!,
    }));
  }, [sorted, todayKey, yesterdayKey]);

  const latestKey = grouped[0]?.key ?? null;

  useEffect(() => {
    if (!selectedDayKey || !latestKey) return;
    const exists = grouped.some((g) => g.key === selectedDayKey);
    if (!exists) setSelectedDayKey(SELECT_LATEST);
  }, [grouped, selectedDayKey, latestKey]);

  const activeGroup = useMemo(() => {
    if (grouped.length === 0) return null;
    if (!selectedDayKey) return grouped[0];
    return grouped.find((g) => g.key === selectedDayKey) ?? grouped[0];
  }, [grouped, selectedDayKey]);

  const selectValue =
    selectedDayKey === SELECT_LATEST || !selectedDayKey
      ? SELECT_LATEST
      : selectedDayKey;

  const stats = useMemo(() => {
    const expenses = filtered
      .filter((r) => r.type === "expense")
      .reduce((sum, r) => sum + r.amount, 0);
    const income = filtered
      .filter((r) => r.type === "income")
      .reduce((sum, r) => sum + r.amount, 0);
    return { expenses, income, total: income - expenses };
  }, [filtered]);

  if (!profile) return null;

  if (profile.role === "parent" && profile.children.length === 0) {
    return (
      <p className={isDark ? "text-gray-400" : "text-gray-600"}>
        Cadastre dependentes pelo app para ver extrato.
      </p>
    );
  }

  const pillBase =
    "rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors font-poppins";
  const pillInactive = isDark
    ? "bg-white/[0.06] text-gray-300 ring-1 ring-white/10 hover:bg-white/[0.1]"
    : "bg-white text-[#64748B] ring-1 ring-[#E2E8F0] hover:bg-[#F8FAFC]";
  const pillActive = isDark
    ? "bg-[#FF66B3]/20 text-[#FFB3D9] ring-1 ring-[#FF66B3]/35"
    : "bg-[#FF66B3]/12 text-[#FF66B3] ring-1 ring-[#FF66B3]/25";

  const selectDayClass = `w-full rounded-xl border px-3 py-2.5 text-sm font-poppins outline-none transition-colors ${
    isDark
      ? "border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.08] focus:border-[#FF66B3] focus:ring-1 focus:ring-[#FF66B3]/30"
      : "border-[#E2E8F0] bg-white text-[#1E293B] hover:border-[#CBD5E1] focus:border-[#FF66B3] focus:ring-1 focus:ring-[#FF66B3]/20"
  }`;

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
          className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#FF66B3]/20 blur-3xl"
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
                  ? "bg-[#FF66B3]/15 text-[#FFB3D9] ring-1 ring-[#FF66B3]/25"
                  : "bg-[#FF66B3]/10 text-[#FF66B3] ring-1 ring-[#FF66B3]/20"
              }`}
            >
              <Receipt className="h-3 w-3" />
              Extrato Lummy
            </span>
            <h1 className="mt-3 font-poppins text-2xl font-bold tracking-tight text-[#FF66B3] sm:text-3xl md:text-4xl">
              Movimentações por dia
            </h1>
            <p
              className={`mt-2 max-w-xl font-poppins text-sm leading-relaxed ${
                isDark ? "text-gray-400" : "text-[#64748B]"
              }`}
            >
              Por padrão mostramos o{" "}
              <strong className="font-semibold text-[#1E293B] dark:text-gray-200">
                dia mais recente
              </strong>
              ; em outros dias, escolha a data abaixo. Criar ou editar
              transações continua no aplicativo.
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
              className="inline-flex items-center rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors border-[#FF66B3]/40 text-[#FF66B3] hover:bg-[#FF66B3]/10"
            >
              ← Painel
            </Link>
          </div>
        </div>
      </section>

      <div
        className={`grid grid-cols-1 gap-4 rounded-2xl border p-4 sm:grid-cols-3 sm:p-5 ${
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
            Receitas
          </p>
          <p className="mt-1 flex items-center gap-2 font-poppins text-2xl font-bold tabular-nums text-[#10B981] sm:text-3xl">
            <TrendingUp className="h-5 w-5" />
            {brl(stats.income)}
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            Despesas
          </p>
          <p className="mt-1 flex items-center gap-2 font-poppins text-2xl font-bold tabular-nums text-[#FF66B3] sm:text-3xl">
            <TrendingDown className="h-5 w-5" />
            {brl(stats.expenses)}
          </p>
        </div>
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            Saldo (filtrado)
          </p>
          <p
            className={`mt-1 flex items-center gap-2 font-poppins text-2xl font-bold tabular-nums sm:text-3xl ${
              stats.total >= 0 ? "text-[#10B981]" : "text-[#FF66B3]"
            }`}
          >
            {stats.total >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            {brl(stats.total)}
          </p>
        </div>
      </div>

      <div
        className={`space-y-4 rounded-2xl border p-4 sm:p-5 ${
          isDark
            ? "border-white/[0.08] bg-[#121826]/60"
            : "border-[#E2E8F0] bg-[#F8FAFC]"
        }`}
      >
        {grouped.length > 1 ? (
          <div>
            <label
              className={`mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-gray-500" : "text-[#64748B]"
              }`}
              htmlFor="tx-day"
            >
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              Dia do extrato
            </label>
            <select
              id="tx-day"
              value={selectValue}
              onChange={(e) =>
                setSelectedDayKey(
                  e.target.value === SELECT_LATEST ? SELECT_LATEST : e.target.value
                )
              }
              className={selectDayClass}
            >
              <option value={SELECT_LATEST}>
                Dia mais recente
                {latestKey && latestKey !== "unknown"
                  ? ` (${shortDayTitle(latestKey, todayKey, yesterdayKey)})`
                  : ""}
              </option>
              {grouped.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.shortTitle} — {g.label} ({g.items.length}{" "}
                  {g.items.length === 1 ? "item" : "itens"})
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className={`mb-2 text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-gray-500" : "text-[#64748B]"
              }`}
            >
              Tipo
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "Todas"],
                  ["income", "Receitas"],
                  ["expense", "Despesas"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTypeFilter(value)}
                  className={`${pillBase} ${
                    typeFilter === value ? pillActive : pillInactive
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full min-w-0 lg:max-w-xs">
            <label
              className={`mb-2 block text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-gray-500" : "text-[#64748B]"
              }`}
              htmlFor="tx-status"
            >
              Status
            </label>
            <select
              id="tx-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectDayClass}
            >
              {statuses.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "Todos" : statusLabel(t)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <Search
            className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
              isDark ? "text-gray-500" : "text-[#94A3B8]"
            }`}
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descrição, categoria ou status…"
            className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm font-poppins outline-none transition-colors ${
              isDark
                ? "border-white/10 bg-white/[0.05] text-white placeholder:text-gray-500 focus:border-[#FF66B3] focus:ring-1 focus:ring-[#FF66B3]/30"
                : "border-[#E2E8F0] bg-white text-[#1E293B] placeholder:text-[#94A3B8] focus:border-[#FF66B3] focus:ring-1 focus:ring-[#FF66B3]/20"
            }`}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-11 w-11 animate-spin rounded-full border-2 border-[#FF66B3] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className={`rounded-2xl border px-6 py-16 text-center font-poppins ${
            isDark
              ? "border-white/[0.08] bg-[#121826]/50 text-gray-500"
              : "border-[#E2E8F0] bg-white text-[#64748B]"
          }`}
        >
          <p className="text-sm font-medium">
            Nenhuma movimentação com estes filtros.
          </p>
          <p className="mt-1 text-xs opacity-80">
            Tente ajustar busca ou filtros ou aguarde novas transações.
          </p>
        </div>
      ) : activeGroup ? (
        (() => {
          const g = activeGroup;
          const dt = dayTotals(g.items);
          const divideLine = isDark
            ? "divide-white/[0.06]"
            : "divide-[#E2E8F0]";
          return (
            <div
              className={`overflow-hidden rounded-xl border ${
                isDark
                  ? "border-white/[0.1] bg-[#121826]/80"
                  : "border-[#E2E8F0] bg-white shadow-sm"
              }`}
            >
              <div
                className={`flex flex-col gap-2 border-b px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-3.5 sm:py-2 ${
                  isDark
                    ? "border-white/[0.08] bg-white/[0.03]"
                    : "border-[#E2E8F0] bg-[#F8FAFC]"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <CalendarDays
                    className="h-4 w-4 shrink-0 text-[#FF66B3]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <h2
                      className={`font-poppins text-sm font-bold leading-tight sm:text-[15px] ${
                        isDark ? "text-white" : "text-[#1E293B]"
                      }`}
                    >
                      {g.shortTitle}
                      <span
                        className={`ml-1.5 font-normal opacity-80 ${
                          isDark ? "text-gray-400" : "text-[#64748B]"
                        }`}
                      >
                        · {dt.count} {dt.count === 1 ? "item" : "itens"}
                      </span>
                    </h2>
                    <p
                      className={`truncate font-poppins text-[11px] leading-tight ${
                        isDark ? "text-gray-500" : "text-[#94A3B8]"
                      }`}
                    >
                      {g.label}
                    </p>
                  </div>
                </div>
                <div
                  className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 font-poppins text-[11px] tabular-nums sm:justify-end sm:text-xs ${
                    isDark ? "text-gray-400" : "text-[#64748B]"
                  }`}
                >
                  <span>
                    <span className="opacity-70">+ </span>
                    <span className="font-semibold text-[#10B981]">
                      {brl(dt.income)}
                    </span>
                  </span>
                  <span className="opacity-30">|</span>
                  <span>
                    <span className="opacity-70">− </span>
                    <span className="font-semibold text-[#FF66B3]">
                      {brl(dt.expense)}
                    </span>
                  </span>
                  <span className="opacity-30">|</span>
                  <span
                    className={`font-semibold ${
                      dt.net >= 0 ? "text-[#10B981]" : "text-[#FF66B3]"
                    }`}
                  >
                    = {dt.net >= 0 ? "+" : ""}
                    {brl(dt.net)}
                  </span>
                </div>
              </div>

              <ul className={`divide-y ${divideLine}`}>
                {g.items.map((t) => {
                  const isExp = t.type === "expense";
                  const bar = isExp ? "bg-[#FF66B3]" : "bg-[#10B981]";
                  return (
                    <li key={t.id} className="list-none">
                      <div
                        className={`flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-3.5 sm:py-2 ${
                          isDark
                            ? "hover:bg-white/[0.03]"
                            : "hover:bg-[#F8FAFC]"
                        }`}
                      >
                        <div
                          className={`h-9 w-0.5 shrink-0 rounded-full ${bar}`}
                          aria-hidden
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                          <div className="min-w-0">
                            <p
                              className={`truncate font-poppins text-[13px] font-semibold leading-tight sm:text-sm ${
                                isDark ? "text-gray-100" : "text-[#1E293B]"
                              }`}
                            >
                              {t.description?.trim() ||
                                t.category ||
                                "Sem título"}
                            </p>
                            <p
                              className={`truncate font-poppins text-[11px] leading-tight ${
                                isDark ? "text-gray-500" : "text-[#94A3B8]"
                              }`}
                            >
                              {t.category || "—"} · {typeLabel(t.type)} ·{" "}
                              {statusLabel(t.status)}
                            </p>
                          </div>
                          <p
                            className={`shrink-0 self-end font-poppins text-[13px] font-bold tabular-nums sm:self-auto sm:text-sm ${
                              isExp ? "text-[#FF66B3]" : "text-[#10B981]"
                            }`}
                          >
                            {isExp ? "−" : "+"}
                            {brl(t.amount)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })()
      ) : null}
    </div>
  );
}
