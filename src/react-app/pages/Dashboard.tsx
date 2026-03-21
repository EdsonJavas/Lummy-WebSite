import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Target,
  TrendingDown,
  Sparkles,
  RefreshCw,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { appRoute } from "@/react-app/lib/appRoutes";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { useSelectedChild } from "@/react-app/context/SelectedChildContext";
import {
  countCatalogAchievementTemplates,
  countUnlockedAchievements,
  fetchChildEngagementStats,
  fetchLegacyAchievements,
  fetchRecentCompletedMissions,
  fetchTodayMissions,
  type DailyMissionRow,
} from "@/react-app/services/engagement";
import {
  activityPulse,
  categoryBreakdown,
  fetchPendingForChildren,
  fetchTransactionsForChildren,
  goalsSummary,
  monthlyTrend,
  spendingLast30Days,
  type CategorySlice,
  type MonthlyPoint,
  type TxRow,
} from "@/react-app/services/dashboardData";

function brl(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(n);
}

function Card({
  title,
  children,
  isDark,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border p-5 sm:p-6 ${className} ${
        isDark
          ? "border-white/[0.08] bg-[#121826]/90 shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          : "border-gray-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]"
      }`}
    >
      <h3
        className={`mb-4 text-xs font-bold uppercase tracking-wider font-poppins ${
          isDark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  isDark,
  iconWrapClass,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  isDark: boolean;
  iconWrapClass: string;
}) {
  return (
    <section
      className={`rounded-3xl border p-5 sm:p-6 ${
        isDark
          ? "border-white/[0.08] bg-gradient-to-br from-[#151c2e]/95 to-[#0f1419] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "border-gray-200/80 bg-gradient-to-br from-white to-gray-50/80 shadow-[0_8px_32px_rgba(15,23,42,0.07)]"
      }`}
    >
      <div
        className={`mb-4 inline-flex rounded-2xl p-3.5 ${iconWrapClass}`}
      >
        <Icon className="h-7 w-7 stroke-[1.75]" />
      </div>
      <p
        className={`text-xs font-bold uppercase tracking-wider ${
          isDark ? "text-gray-500" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <div
        className={`mt-1 text-2xl font-bold tabular-nums sm:text-3xl font-poppins ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </div>
      {hint != null && (
        <p
          className={`mt-2 text-xs leading-relaxed ${
            isDark ? "text-gray-500" : "text-gray-600"
          }`}
        >
          {hint}
        </p>
      )}
    </section>
  );
}

/** Altura fixa evita 0px quando o pai não resolve `height: 100%` (flex/grid). */
const PULSE_CHART_PX = 240;

/** Amplifica variações para um traço mais “cardíaco” (só visual). */
function ecgStyleSeries(points: { day: string; pulse: number }[]) {
  return points.map((p, i) => {
    const prev = points[i - 1]?.pulse ?? p.pulse;
    const base = p.pulse * 12 + 40;
    const spike = (p.pulse - prev) * 25;
    const wobble = Math.sin(i * 1.7) * 6;
    return {
      t: p.day.slice(5),
      v: Math.max(8, base + spike + wobble),
    };
  });
}

export default function DashboardPage() {
  const { isDark } = useTheme();
  const { profile, refreshProfile } = useAuth();
  const { selectedChildId, selectedChild } = useSelectedChild();
  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState<TxRow[]>([]);
  const [pending, setPending] = useState<TxRow[]>([]);
  const [monthly, setMonthly] = useState<MonthlyPoint[]>([]);
  const [categories, setCategories] = useState<CategorySlice[]>([]);
  const [pulse, setPulse] = useState<{ day: string; pulse: number }[]>([]);
  const [goals, setGoals] = useState({ total: 0, completed: 0, avgProgress: 0 });
  const [spend30, setSpend30] = useState<Record<string, number>>({});
  const [engStats, setEngStats] = useState({ total_points: 0, level: 1 });
  const [todayMissions, setTodayMissions] = useState<DailyMissionRow[]>([]);
  const [recentDoneMissions, setRecentDoneMissions] = useState<
    DailyMissionRow[]
  >([]);
  const [achSummary, setAchSummary] = useState("");

  const activeChildIds = useMemo(() => {
    if (!profile) return [];
    if (profile.role === "child") return [profile.child.id];
    if (selectedChildId) return [selectedChildId];
    return [];
  }, [profile, selectedChildId]);

  const load = useCallback(async () => {
    if (activeChildIds.length === 0) {
      setLoading(false);
      setTx([]);
      setPending([]);
      setMonthly([]);
      setCategories([]);
      setPulse([]);
      setGoals({ total: 0, completed: 0, avgProgress: 0 });
      setSpend30({});
      setEngStats({ total_points: 0, level: 1 });
      setTodayMissions([]);
      setRecentDoneMissions([]);
      setAchSummary("");
      return;
    }
    setLoading(true);
    try {
      const cid = activeChildIds[0];
      const [
        transactions,
        pend,
        trend,
        cats,
        pul,
        g,
        spendMap,
        parentPend,
        mToday,
        mRecent,
        eStats,
        nUnlock,
      ] = await Promise.all([
        fetchTransactionsForChildren(activeChildIds, 60),
        fetchPendingForChildren(activeChildIds),
        monthlyTrend(activeChildIds, 4),
        categoryBreakdown(activeChildIds),
        activityPulse(activeChildIds, 7),
        goalsSummary(cid),
        spendingLast30Days(activeChildIds),
        profile?.role === "parent"
          ? fetchPendingForChildren(
              profile.children.map((c) => c.id)
            )
          : Promise.resolve([] as TxRow[]),
        fetchTodayMissions(cid),
        fetchRecentCompletedMissions(cid, 6),
        fetchChildEngagementStats(cid),
        countUnlockedAchievements(cid),
      ]);
      setTx(transactions);
      setPending(profile?.role === "parent" ? parentPend : pend);
      setMonthly(trend);
      setCategories(cats);
      setPulse(pul);
      setGoals(g);
      setSpend30(spendMap);
      setTodayMissions(mToday);
      setRecentDoneMissions(mRecent);
      setEngStats(eStats);
      if (nUnlock !== null) {
        const total = await countCatalogAchievementTemplates();
        setAchSummary(
          total > 0
            ? `${nUnlock} desbloqueadas de ${total} no catálogo`
            : `${nUnlock} conquistas desbloqueadas`
        );
      } else {
        const leg = await fetchLegacyAchievements(cid);
        const done = leg.filter((x) => x.is_completed).length;
        const open = leg.filter((x) => !x.is_completed).length;
        setAchSummary(`${done} concluídas · ${open} em aberto (perfil)`);
      }
    } finally {
      setLoading(false);
    }
  }, [activeChildIds, profile]);

  useEffect(() => {
    void load();
  }, [load]);

  const ecgData = useMemo(() => ecgStyleSeries(pulse), [pulse]);
  const pulseFillId = `pulseFill-${useId().replace(/:/g, "")}`;
  const pulseTotal = useMemo(
    () => pulse.reduce((s, p) => s + p.pulse, 0),
    [pulse]
  );
  const missionsTodayDone = todayMissions.filter((m) => m.is_completed).length;
  const missionsTodayTotal = todayMissions.length;
  const greetingName =
    profile?.role === "parent"
      ? profile.parent.name
      : profile?.role === "child"
        ? profile.child.name
        : "";

  if (!profile) {
    return (
      <div className={isDark ? "text-gray-400" : "text-gray-600"}>
        Carregando perfil…
      </div>
    );
  }

  if (profile.role === "parent" && profile.children.length === 0) {
    return (
      <div className="max-w-lg">
        <h1 className="text-2xl font-bold font-poppins text-lummy-blue mb-2">
          Bem-vindo, {profile.parent.name}
        </h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Nenhum filho vinculado ainda. Cadastre dependentes pelo aplicativo para
          ver dashboards e gráficos aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6 pb-8">
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 ${
          isDark
            ? "border-white/[0.08] bg-[#121826]"
            : "border-gray-200/90 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
        }`}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-lummy-blue/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-lummy-orange/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-lummy-pink/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider border-lummy-blue/30 bg-lummy-blue/10 text-lummy-blue">
              <Sparkles className="h-3.5 w-3.5" />
              Painel Lummy
            </div>
            <h1 className="font-poppins text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              <span className={isDark ? "text-white" : "text-gray-900"}>
                Olá, {greetingName}
              </span>
              {selectedChild && profile.role === "parent" && (
                <span
                  className={`mt-1 block text-lg font-semibold sm:text-xl ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Acompanhando{" "}
                  <span className="text-lummy-orange">{selectedChild.name}</span>
                </span>
              )}
            </h1>
            <p
              className={`max-w-xl text-sm leading-relaxed ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Mesma linha visual do app: leitura, gráficos e atalhos. Transferências
              e aprovações continuam só no aplicativo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refreshProfile().then(() => load())}
            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all ${
              isDark
                ? "bg-white/[0.08] text-white ring-1 ring-white/10 hover:bg-white/[0.12]"
                : "bg-gray-900 text-white shadow-lg shadow-gray-900/15 hover:bg-gray-800"
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar dados
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-lummy-orange border-t-transparent" />
        </div>
      ) : (
        <>
          <div
            className={`grid gap-4 sm:grid-cols-2 ${
              profile.role === "parent" ? "xl:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            <StatTile
              icon={Wallet}
              label="Saldo do dependente"
              value={selectedChild ? brl(selectedChild.balance) : "—"}
              hint={
                selectedChild ? (
                  <>Mesada {brl(selectedChild.allowance)}</>
                ) : undefined
              }
              isDark={isDark}
              iconWrapClass="bg-lummy-green/15 text-lummy-green"
            />
            {profile.role === "parent" && (
              <StatTile
                icon={Wallet}
                label="Sua carteira"
                value={brl(profile.parent.balance)}
                hint="Somente leitura aqui no site"
                isDark={isDark}
                iconWrapClass="bg-lummy-blue/15 text-lummy-blue"
              />
            )}
            <StatTile
              icon={Target}
              label="Metas"
              value={
                <span className="text-lummy-orange">
                  {goals.completed}/{goals.total}
                </span>
              }
              hint={
                <>
                  Concluídas / total · progresso médio das em andamento{" "}
                  <span className="tabular-nums font-semibold text-lummy-green">
                    {(goals.avgProgress * 100).toFixed(0)}%
                  </span>
                </>
              }
              isDark={isDark}
              iconWrapClass="bg-lummy-orange/15 text-lummy-orange"
            />
            <StatTile
              icon={TrendingDown}
              label="Gastos (30 dias)"
              value={
                <span className="text-lummy-pink">
                  {selectedChildId
                    ? brl(spend30[selectedChildId] ?? 0)
                    : brl(0)}
                </span>
              }
              hint="Despesas aprovadas ou concluídas no período"
              isDark={isDark}
              iconWrapClass="bg-lummy-pink/15 text-lummy-pink"
            />
          </div>

          <div
            className={`flex flex-wrap gap-2 rounded-3xl border p-4 ${
              isDark
                ? "border-white/[0.08] bg-[#121826]/60"
                : "border-gray-200/90 bg-gray-50/80"
            }`}
          >
            <span
              className={`mr-1 flex w-full items-center text-xs font-bold uppercase tracking-wider sm:mr-2 sm:w-auto ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Atalhos
            </span>
            {(
              [
                [appRoute("missoes"), "Missões"],
                [appRoute("conquistas"), "Conquistas"],
                [appRoute("metas"), "Metas"],
                [appRoute("extrato"), "Extrato"],
              ] as const
            ).map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  isDark
                    ? "bg-white/[0.06] text-lummy-blue ring-1 ring-white/10 hover:bg-white/[0.1]"
                    : "bg-white text-lummy-blue shadow-sm ring-1 ring-gray-200/80 hover:shadow-md"
                }`}
              >
                {label}
                <ArrowRight className="h-4 w-4 opacity-70" />
              </Link>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Nível & pontos" isDark={isDark}>
              <p className="text-3xl font-bold text-lummy-orange">
                Nv. {engStats.level}
              </p>
              <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {engStats.total_points.toLocaleString("pt-BR")} pontos totais
              </p>
            </Card>
            <Card title="Missões hoje" isDark={isDark}>
              <p className="text-3xl font-bold text-lummy-blue">
                {missionsTodayTotal > 0
                  ? `${missionsTodayDone}/${missionsTodayTotal}`
                  : "—"}
              </p>
              <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                concluídas / do dia
              </p>
              <Link
                to={appRoute("missoes")}
                className="inline-block mt-3 text-sm text-lummy-blue font-medium hover:underline"
              >
                Ver detalhes
              </Link>
            </Card>
            <Card title="Conquistas" isDark={isDark} className="sm:col-span-2 lg:col-span-2">
              <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {achSummary || "Carregando resumo…"}
              </p>
              <Link
                to={appRoute("conquistas")}
                className="inline-block mt-3 text-sm text-lummy-orange font-medium hover:underline"
              >
                Abrir vitrine de conquistas
              </Link>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card title="Missões de hoje (lista)" isDark={isDark}>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {todayMissions.map((m) => (
                  <li
                    key={m.id}
                    className={`flex items-center justify-between gap-2 text-sm rounded-xl px-3 py-2 ${
                      isDark ? "bg-gray-800/60" : "bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{m.mission?.emoji ?? "⭐"}</span>
                      <span className="truncate font-medium">
                        {m.mission?.title ?? "Missão"}
                      </span>
                    </span>
                    <span
                      className={`text-xs shrink-0 px-2 py-0.5 rounded-full ${
                        m.is_completed
                          ? "bg-lummy-green/20 text-lummy-green"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {m.is_completed ? "OK" : "Pendente"}
                    </span>
                  </li>
                ))}
                {todayMissions.length === 0 && (
                  <li className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Nenhuma missão agendada para hoje.
                  </li>
                )}
              </ul>
            </Card>
            <Card title="Últimas missões concluídas" isDark={isDark}>
              <ul className="space-y-2 max-h-64 overflow-y-auto">
                {recentDoneMissions.map((m) => (
                  <li
                    key={m.id}
                    className={`text-sm rounded-xl px-3 py-2 ${
                      isDark ? "bg-gray-800/60" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{m.mission?.emoji ?? "✓"}</span>
                      <span className="font-medium truncate">
                        {m.mission?.title ?? "Missão"}
                      </span>
                    </div>
                    <div className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                      {m.completed_at
                        ? new Date(m.completed_at).toLocaleString("pt-BR")
                        : m.selected_date}{" "}
                      · +{m.points_earned ?? m.mission?.points ?? 0} pts
                    </div>
                  </li>
                ))}
                {recentDoneMissions.length === 0 && (
                  <li className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Nenhuma conclusão recente.
                  </li>
                )}
              </ul>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card title="Tendência mensal" isDark={isDark}>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                    <XAxis dataKey="label" tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }} />
                    <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: isDark ? "#1e293b" : "#fff",
                        border: "1px solid #334155",
                        borderRadius: 12,
                      }}
                      formatter={(v) =>
                        brl(typeof v === "number" ? v : Number(v) || 0)
                      }
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" name="Entradas" stroke="#62C370" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="expense" name="Saídas" stroke="#FF66B3" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Gastos por categoria (30 dias)" isDark={isDark}>
              {categories.length === 0 ? (
                <div className="flex h-72 items-center justify-center">
                  <p
                    className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Sem despesas no período
                  </p>
                </div>
              ) : (
                <div className="flex h-80 w-full flex-col gap-3">
                  <div className="min-h-0 flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                        <Pie
                          data={categories}
                          dataKey="value"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          innerRadius={48}
                          outerRadius={78}
                          paddingAngle={2}
                        >
                          {categories.map((c) => (
                            <Cell key={c.category} fill={c.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v) =>
                            brl(typeof v === "number" ? v : Number(v) || 0)
                          }
                        />
                        <Legend
                          verticalAlign="bottom"
                          layout="horizontal"
                          align="center"
                          wrapperStyle={{ width: "100%" }}
                          formatter={(value, entry) => {
                            const pl = entry.payload as
                              | CategorySlice
                              | undefined;
                            const pct =
                              pl?.percentage != null
                                ? `${pl.percentage}%`
                                : "";
                            return (
                              <span
                                className={
                                  isDark ? "text-gray-200" : "text-gray-800"
                                }
                              >
                                {value}
                                {pct ? ` · ${pct}` : ""}
                              </span>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul
                    className={`shrink-0 flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-dashed pt-3 text-xs ${
                      isDark
                        ? "border-white/10 text-gray-300"
                        : "border-slate-200 text-gray-700"
                    }`}
                    aria-label="Legenda de categorias"
                  >
                    {categories.map((c) => (
                      <li
                        key={c.category}
                        className="flex max-w-[14rem] items-center gap-2"
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: c.color }}
                          aria-hidden
                        />
                        <span className="min-w-0 truncate font-medium">
                          {c.category}
                        </span>
                        <span
                          className={`shrink-0 tabular-nums ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {c.percentage}% · {brl(c.value)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          <Card title="Ritmo de atividade (pulso)" isDark={isDark}>
            <div className="space-y-3">
              <div
                className={`flex flex-wrap items-start justify-between gap-2 text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <p className="max-w-xl leading-relaxed">
                  <span className="font-semibold text-lummy-pink">Legenda: </span>
                  linha rosa = ritmo visual derivado do{" "}
                  <strong>número de lançamentos por dia</strong> (não é dado
                  médico). Eixo inferior = dia (MM-DD).
                </p>
                {pulse.length > 0 && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 tabular-nums font-medium ${
                      isDark
                        ? "bg-white/[0.06] text-gray-200"
                        : "bg-lummy-pink/10 text-lummy-pink"
                    }`}
                  >
                    {pulseTotal} mov. · 7 dias
                  </span>
                )}
              </div>

              {/* Altura explícita no wrapper: Recharts + flex + items-center quebrava height="100%". */}
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_11.5rem] sm:items-start">
                {pulse.length === 0 ? (
                  <div
                    className={`flex h-56 w-full items-center justify-center text-sm sm:col-span-2 ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Sem dados de movimentação neste período.
                  </div>
                ) : (
                  <>
                    <div
                      className="w-full min-w-0"
                      style={{ height: PULSE_CHART_PX }}
                    >
                      <ResponsiveContainer
                        width="100%"
                        height={PULSE_CHART_PX}
                      >
                        <AreaChart data={ecgData} margin={{ left: 4, right: 8 }}>
                          <defs>
                            <linearGradient
                              id={pulseFillId}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#FF66B3"
                                stopOpacity={0.35}
                              />
                              <stop
                                offset="100%"
                                stopColor="#FF66B3"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? "#334155" : "#e2e8f0"}
                          />
                          <XAxis
                            dataKey="t"
                            tick={{
                              fill: isDark ? "#94a3b8" : "#64748b",
                              fontSize: 11,
                            }}
                          />
                          <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                          <Tooltip
                            contentStyle={{
                              background: isDark ? "#1e293b" : "#fff",
                              border: "1px solid #334155",
                              borderRadius: 12,
                            }}
                            formatter={(v) => [
                              `${Number(v ?? 0).toFixed(0)}`,
                              "Ritmo (visual)",
                            ]}
                            labelFormatter={(label) => `Dia ${label}`}
                          />
                          <Legend
                            verticalAlign="top"
                            align="right"
                            wrapperStyle={{ top: -6, right: 0 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="v"
                            name="Ritmo de atividade"
                            stroke="#FF66B3"
                            strokeWidth={2}
                            fill={`url(#${pulseFillId})`}
                            isAnimationActive
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <ul
                      className={`flex max-h-60 w-full flex-wrap content-start justify-center gap-2 sm:max-h-none sm:flex-col sm:justify-start ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                      aria-label="Movimentações por dia"
                    >
                      {pulse.map((p) => {
                        const d = new Date(`${p.day}T12:00:00`);
                        const label = d.toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "2-digit",
                        });
                        return (
                          <li
                            key={p.day}
                            className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                              isDark ? "bg-white/[0.05]" : "bg-gray-100"
                            }`}
                          >
                            <span className="capitalize">{label}</span>
                            <span className="tabular-nums font-semibold text-lummy-pink">
                              {p.pulse}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card title="Últimas movimentações" isDark={isDark}>
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {tx.slice(0, 12).map((t) => (
                  <li
                    key={t.id}
                    className={`flex justify-between gap-2 text-sm rounded-xl px-3 py-2 ${
                      isDark ? "bg-gray-800/60" : "bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{t.description || t.category}</div>
                      <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                        {t.category} · {t.status}
                      </div>
                    </div>
                    <div
                      className={`shrink-0 font-semibold ${
                        t.type === "expense" ? "text-lummy-pink" : "text-lummy-green"
                      }`}
                    >
                      {t.type === "expense" ? "−" : "+"}
                      {brl(t.amount)}
                    </div>
                  </li>
                ))}
                {tx.length === 0 && (
                  <li className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Nenhuma transação recente
                  </li>
                )}
              </ul>
            </Card>

            <Card title="Pendentes de aprovação (visualização)" isDark={isDark}>
              <p className={`text-xs -mt-2 mb-3 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {profile.role === "parent"
                  ? "Todos os filhos — aprove pelo app."
                  : "Acompanhe o status; ações ficam no app."}
              </p>
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {pending.slice(0, 15).map((t) => (
                  <li
                    key={t.id}
                    className={`text-sm rounded-xl px-3 py-2 border ${
                      isDark
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-amber-200 bg-amber-50"
                    }`}
                  >
                    <div className="font-medium">{t.description || t.category}</div>
                    <div className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {brl(t.amount)} · {t.category}
                    </div>
                  </li>
                ))}
                {pending.length === 0 && (
                  <li className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                    Nada pendente
                  </li>
                )}
              </ul>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
