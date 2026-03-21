import { supabase } from "@/react-app/lib/supabase";
import {
  goalRowIsCompleted,
  goalRowIsInProgress,
} from "@/react-app/lib/goalStatus";

export type TxRow = {
  id: string;
  child_id: string;
  amount: number;
  type: string;
  status: string;
  category: string;
  description: string;
  date: string;
  created_at: string;
};

export type GoalRow = {
  status: string;
  target_amount: number;
  current_amount: number;
  completed_at?: string | null;
};

export type MonthlyPoint = {
  key: string;
  label: string;
  income: number;
  expense: number;
};

export type CategorySlice = {
  category: string;
  value: number;
  percentage: number;
  color: string;
};

/** YYYY-MM-DD no fuso local (alinha buckets com o calendário do usuário). */
function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const COLORS = [
  "#2563EB",
  "#FF8D15",
  "#8B5CF6",
  "#62C370",
  "#64748B",
];

function parseTx(row: Record<string, unknown>): TxRow {
  return {
    id: String(row.id),
    child_id: String(row.child_id),
    amount: Number(row.amount) || 0,
    type: String(row.type ?? ""),
    status: String(row.status ?? ""),
    category: String(row.category ?? ""),
    description: String(row.description ?? ""),
    date: String(row.date ?? row.created_at ?? ""),
    created_at: String(row.created_at ?? ""),
  };
}

export async function fetchTransactionsForChildren(
  childIds: string[],
  limit = 80
): Promise<TxRow[]> {
  if (childIds.length === 0) return [];
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id,child_id,amount,type,status,category,description,date,created_at"
    )
    .in("child_id", childIds)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("fetchTransactionsForChildren", error.message);
    return [];
  }
  return (data ?? []).map((r) => parseTx(r as Record<string, unknown>));
}

export async function fetchPendingForChildren(
  childIds: string[]
): Promise<TxRow[]> {
  if (childIds.length === 0) return [];
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id,child_id,amount,type,status,category,description,date,created_at"
    )
    .eq("status", "pending")
    .in("child_id", childIds)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    console.warn("fetchPendingForChildren", error.message);
    return [];
  }
  const rows = (data ?? []).map((r) => parseTx(r as Record<string, unknown>));
  return rows.filter((row) => {
    const cat = row.category.toLowerCase();
    const type = row.type.toLowerCase();
    const isQrMoneyRequest = type === "income" && cat === "pedido";
    return !isQrMoneyRequest;
  });
}

export async function spendingLast30Days(
  childIds: string[]
): Promise<Record<string, number>> {
  if (childIds.length === 0) return {};
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { data, error } = await supabase
    .from("transactions")
    .select("child_id, amount")
    .eq("type", "expense")
    .gte("date", since.toISOString())
    .in("child_id", childIds)
    .in("status", ["approved", "completed"]);
  if (error) {
    console.warn("spendingLast30Days", error.message);
    return {};
  }
  const map: Record<string, number> = {};
  for (const row of data ?? []) {
    const r = row as { child_id: string; amount: number };
    map[r.child_id] = (map[r.child_id] ?? 0) + Number(r.amount);
  }
  return map;
}

export async function categoryBreakdown(
  childIds: string[]
): Promise<CategorySlice[]> {
  if (childIds.length === 0) return [];
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { data, error } = await supabase
    .from("transactions")
    .select("category, amount")
    .eq("type", "expense")
    .gte("date", since.toISOString())
    .in("child_id", childIds)
    .in("status", ["approved", "completed"]);
  if (error) {
    console.warn("categoryBreakdown", error.message);
    return [];
  }
  const catMap: Record<string, number> = {};
  let total = 0;
  for (const row of data ?? []) {
    const r = row as { category: string; amount: number };
    const a = Number(r.amount) || 0;
    catMap[r.category] = (catMap[r.category] ?? 0) + a;
    total += a;
  }
  if (total <= 0) return [];
  const entries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  return entries.map(([category, value], i) => ({
    category,
    value,
    percentage: Math.round((value / total) * 1000) / 10,
    color: COLORS[i % COLORS.length],
  }));
}

export async function monthlyTrend(
  childIds: string[],
  monthsBack = 4
): Promise<MonthlyPoint[]> {
  if (childIds.length === 0) return [];
  const now = new Date();
  const labels = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const points: MonthlyPoint[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
    const { data, error } = await supabase
      .from("transactions")
      .select("type, amount")
      .gte("date", d.toISOString())
      .lte("date", end.toISOString())
      .in("child_id", childIds)
      .in("status", ["approved", "completed"]);
    if (error) {
      console.warn("monthlyTrend", error.message);
      continue;
    }
    let income = 0;
    let expense = 0;
    for (const row of data ?? []) {
      const r = row as { type: string; amount: number };
      const a = Number(r.amount) || 0;
      const t = (r.type ?? "").toLowerCase();
      if (t === "expense") expense += a;
      else if (["income", "allowance", "reward"].includes(t)) income += a;
    }
    points.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: labels[d.getMonth()],
      income,
      expense,
    });
  }
  return points;
}

export async function goalsSummary(childId: string) {
  const { data, error } = await supabase
    .from("goals")
    .select("status, target_amount, current_amount, completed_at")
    .eq("child_id", childId);
  if (error) {
    console.warn("goalsSummary", error.message);
    return {
      total: 0,
      completed: 0,
      avgProgress: 0,
    };
  }
  const rows = (data ?? []) as GoalRow[];
  const total = rows.length;
  const completed = rows.filter((g) => goalRowIsCompleted(g)).length;
  let sum = 0;
  let n = 0;
  for (const g of rows) {
    if (!goalRowIsInProgress(g)) continue;
    const t = Number(g.target_amount) || 0;
    const c = Number(g.current_amount) || 0;
    if (t > 0) {
      sum += c / t;
      n++;
    }
  }
  return {
    total,
    completed,
    avgProgress: n > 0 ? sum / n : 0,
  };
}

/** Contagem de movimentações por dia (últimos 7 dias) — visualização tipo “pulso”. */
export async function activityPulse(
  childIds: string[],
  days = 7
): Promise<{ day: string; pulse: number }[]> {
  if (childIds.length === 0) return [];
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from("transactions")
    .select("created_at")
    .gte("created_at", start.toISOString())
    .in("child_id", childIds);
  if (error) {
    console.warn("activityPulse", error.message);
    return [];
  }
  const counts: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    counts[localDateKey(d)] = 0;
  }
  for (const row of data ?? []) {
    const raw = (row as { created_at: string }).created_at;
    if (!raw) continue;
    const key = localDateKey(new Date(raw));
    if (counts[key] !== undefined) counts[key] += 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, pulse]) => ({ day, pulse }));
}
