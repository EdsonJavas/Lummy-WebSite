import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
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

export default function TransactionsPage() {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const { selectedChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TxRow[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const types = useMemo(() => {
    const s = new Set(rows.map((r) => r.type));
    return ["all", ...Array.from(s)];
  }, [rows]);

  const statuses = useMemo(() => {
    const s = new Set(rows.map((r) => r.status));
    return ["all", ...Array.from(s)];
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });
  }, [rows, typeFilter, statusFilter]);

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
              Movimentações completas
            </h1>
            <p
              className={`mt-2 max-w-xl font-poppins text-sm leading-relaxed ${
                isDark ? "text-gray-400" : "text-[#64748B]"
              }`}
            >
              Mesmo visual do app: acompanhe todas as transações e movimentações.
              Criar ou editar transações continua no aplicativo.
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
            Saldo
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
        className={`flex flex-wrap gap-4 rounded-2xl border p-3 sm:p-4 ${
          isDark
            ? "border-white/[0.08] bg-[#121826]/60"
            : "border-[#E2E8F0] bg-[#F8FAFC]"
        }`}
      >
        <div className="flex-1 min-w-[140px]">
          <label
            className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            Tipo
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-sm font-poppins outline-none transition-colors ${
              isDark
                ? "border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.08] focus:border-[#FF66B3] focus:ring-1 focus:ring-[#FF66B3]/30"
                : "border-[#E2E8F0] bg-white text-[#1E293B] hover:border-[#CBD5E1] focus:border-[#FF66B3] focus:ring-1 focus:ring-[#FF66B3]/20"
            }`}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "Todos" : t}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label
            className={`block text-[10px] font-bold uppercase tracking-wider mb-2 ${
              isDark ? "text-gray-500" : "text-[#64748B]"
            }`}
          >
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-sm font-poppins outline-none transition-colors ${
              isDark
                ? "border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.08] focus:border-[#FF66B3] focus:ring-1 focus:ring-[#FF66B3]/30"
                : "border-[#E2E8F0] bg-white text-[#1E293B] hover:border-[#CBD5E1] focus:border-[#FF66B3] focus:ring-1 focus:ring-[#FF66B3]/20"
            }`}
          >
            {statuses.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "Todos" : t}
              </option>
            ))}
          </select>
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
            Tente ajustar os filtros ou aguarde novas transações.
          </p>
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-2xl border ${
            isDark
              ? "border-white/[0.08] bg-[#121826]/50"
              : "border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
          }`}
        >
          <div className="w-full overflow-x-auto -mx-1">
            <table className="w-full min-w-[720px] text-sm text-left border-collapse">
              <thead>
                <tr
                  className={`border-b ${
                    isDark
                      ? "border-white/[0.06] text-gray-400"
                      : "border-[#E2E8F0] text-[#64748B]"
                  }`}
                >
                  <th className="py-4 pr-4 pl-5 font-medium font-poppins text-xs uppercase tracking-wider">
                    Data
                  </th>
                  <th className="py-4 pr-4 font-medium font-poppins text-xs uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="py-4 pr-4 font-medium font-poppins text-xs uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="py-4 pr-4 font-medium font-poppins text-xs uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="py-4 pr-4 font-medium font-poppins text-xs uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 pl-4 pr-5 font-medium font-poppins text-xs uppercase tracking-wider text-right">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className={`border-b transition-colors ${
                      isDark
                        ? "border-white/[0.04] hover:bg-white/[0.03]"
                        : "border-[#E2E8F0] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <td className="py-4 pr-4 pl-5 whitespace-nowrap tabular-nums font-poppins text-xs">
                      <span
                        className={
                          isDark ? "text-gray-400" : "text-[#64748B]"
                        }
                      >
                        {t.date
                          ? new Date(t.date).toLocaleDateString("pt-BR")
                          : "—"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 max-w-md">
                      <span
                        className={`line-clamp-2 font-poppins ${
                          isDark ? "text-gray-200" : "text-[#1E293B]"
                        }`}
                      >
                        {t.description || "—"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-poppins text-xs">
                      <span
                        className={
                          isDark ? "text-gray-400" : "text-[#64748B]"
                        }
                      >
                        {t.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-poppins text-xs">
                      <span
                        className={
                          isDark ? "text-gray-400" : "text-[#64748B]"
                        }
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-poppins text-xs">
                      <span
                        className={
                          isDark ? "text-gray-400" : "text-[#64748B]"
                        }
                      >
                        {t.status}
                      </span>
                    </td>
                    <td
                      className={`py-4 pl-4 pr-5 text-right font-poppins font-semibold tabular-nums ${
                        t.type === "expense"
                          ? "text-[#FF66B3]"
                          : "text-[#10B981]"
                      }`}
                    >
                      {t.type === "expense" ? "−" : "+"}
                      {brl(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
