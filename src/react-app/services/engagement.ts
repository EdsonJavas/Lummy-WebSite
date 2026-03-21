import { supabase } from "@/react-app/lib/supabase";
import { localDateKey } from "@/react-app/lib/dateUtils";

/** Vários projetos não têm `child_achievements` (só `achievements` com `child_id`). */
function isChildAchievementsUnavailable(err: {
  code?: string;
  message?: string;
}): boolean {
  const code = String(err.code ?? "");
  const msg = (err.message ?? "").toLowerCase();
  return (
    code === "PGRST205" ||
    msg.includes("does not exist") ||
    msg.includes("could not find the table") ||
    msg.includes("schema cache")
  );
}

let skipChildAchievementsTable = false;

async function countLegacyCompletedAchievements(
  childId: string
): Promise<number | null> {
  const { count, error } = await supabase
    .from("achievements")
    .select("*", { count: "exact", head: true })
    .eq("child_id", childId)
    .eq("is_completed", true);
  if (error || count == null) return null;
  return count;
}

export type MissionTemplate = {
  title: string;
  description: string;
  emoji: string;
  points: number;
  progress_target: number;
  color_hex: string;
  category?: string | null;
};

export type DailyMissionRow = {
  id: string;
  is_completed: boolean;
  completed_at: string | null;
  progress: number;
  points_earned: number | null;
  selected_date: string;
  mission: MissionTemplate | null;
};

export type ChildEngagementStats = {
  total_points: number;
  level: number;
};

export type GoalRowFull = {
  id: string;
  name: string;
  emoji: string;
  target_amount: number;
  current_amount: number;
  status: string;
  deadline: string | null;
  description: string | null;
  created_at: string;
  completed_at: string | null;
};

export type CatalogAchievement = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  emoji?: string;
  color_hex?: string;
  points_required?: number;
};

export type UnlockedRow = {
  achievement_id: string;
  unlocked_at: string;
  template: CatalogAchievement | null;
};

export type LegacyAchievementRow = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  is_completed: boolean;
  completed_date: string | null;
  created_at: string;
};

function mapDailyMission(row: Record<string, unknown>): DailyMissionRow {
  const m = row.missions as Record<string, unknown> | null;
  return {
    id: String(row.id),
    is_completed: Boolean(row.is_completed),
    completed_at: row.completed_at ? String(row.completed_at) : null,
    progress: Number(row.progress) || 0,
    points_earned:
      row.points_earned != null ? Number(row.points_earned) : null,
    selected_date: String(row.selected_date ?? ""),
    mission: m
      ? {
          title: String(m.title ?? ""),
          description: String(m.description ?? ""),
          emoji: String(m.emoji ?? "⭐"),
          points: Number(m.points) || 0,
          progress_target: Number(m.progress_target) || 1,
          color_hex: String(m.color_hex ?? "3B82F6"),
          category: m.category != null ? String(m.category) : null,
        }
      : null,
  };
}

export async function fetchChildEngagementStats(
  childId: string
): Promise<ChildEngagementStats> {
  const { data, error } = await supabase
    .from("children")
    .select("total_points, level")
    .eq("id", childId)
    .maybeSingle();
  if (error || !data) {
    return { total_points: 0, level: 1 };
  }
  const r = data as Record<string, unknown>;
  return {
    total_points: Number(r.total_points) || 0,
    level: Number(r.level) || 1,
  };
}

export async function fetchTodayMissions(
  childId: string
): Promise<DailyMissionRow[]> {
  const today = localDateKey();
  const { data, error } = await supabase
    .from("daily_missions")
    .select(
      "id, is_completed, completed_at, progress, points_earned, selected_date, missions ( title, description, emoji, points, progress_target, color_hex, category )"
    )
    .eq("child_id", childId)
    .eq("selected_date", today);
  if (error) {
    console.warn("fetchTodayMissions", error.message);
    return [];
  }
  return (data ?? []).map((r) =>
    mapDailyMission(r as Record<string, unknown>)
  );
}

/** Missões diárias nos últimos N dias (histórico). */
export async function fetchMissionsDateRange(
  childId: string,
  daysBack: number
): Promise<DailyMissionRow[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - daysBack);
  const from = localDateKey(start);
  const to = localDateKey(end);
  const { data, error } = await supabase
    .from("daily_missions")
    .select(
      "id, is_completed, completed_at, progress, points_earned, selected_date, missions ( title, description, emoji, points, progress_target, color_hex, category )"
    )
    .eq("child_id", childId)
    .gte("selected_date", from)
    .lte("selected_date", to)
    .order("selected_date", { ascending: false });
  if (error) {
    console.warn("fetchMissionsDateRange", error.message);
    return [];
  }
  return (data ?? []).map((r) =>
    mapDailyMission(r as Record<string, unknown>)
  );
}

export async function fetchRecentCompletedMissions(
  childId: string,
  limit = 40
): Promise<DailyMissionRow[]> {
  const { data, error } = await supabase
    .from("daily_missions")
    .select(
      "id, is_completed, completed_at, progress, points_earned, selected_date, missions ( title, description, emoji, points, progress_target, color_hex, category )"
    )
    .eq("child_id", childId)
    .eq("is_completed", true)
    .order("completed_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("fetchRecentCompletedMissions", error.message);
    return [];
  }
  return (data ?? []).map((r) =>
    mapDailyMission(r as Record<string, unknown>)
  );
}

export async function fetchGoalsForChild(
  childId: string
): Promise<GoalRowFull[]> {
  const { data, error } = await supabase
    .from("goals")
    .select(
      "id, name, emoji, target_amount, current_amount, status, description, created_at, completed_at"
    )
    .eq("child_id", childId)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("fetchGoalsForChild", error.message);
    return [];
  }
  return (data ?? []).map((r) => {
    const x = r as Record<string, unknown>;
    return {
      id: String(x.id),
      name: String(x.name ?? ""),
      emoji: String(x.emoji ?? "🎯"),
      target_amount: Number(x.target_amount) || 0,
      current_amount: Number(x.current_amount) || 0,
      status: String(x.status ?? "active"),
      /* Schema antigo (migration goals) não tem deadline; supabase_schema tem. */
      deadline: null,
      description: x.description != null ? String(x.description) : null,
      created_at: String(x.created_at ?? ""),
      completed_at: x.completed_at ? String(x.completed_at) : null,
    };
  });
}

/** Catálogo + desbloqueios (tabelas child_achievements + achievements). */
export async function fetchCatalogAchievementState(childId: string): Promise<{
  mode: "catalog";
  catalog: CatalogAchievement[];
  unlocks: UnlockedRow[];
} | null> {
  if (skipChildAchievementsTable) {
    return null;
  }

  const unlockRes = await supabase
    .from("child_achievements")
    .select("achievement_id, unlocked_at, achievements(*)")
    .eq("child_id", childId)
    .order("unlocked_at", { ascending: false });

  if (unlockRes.error) {
    if (isChildAchievementsUnavailable(unlockRes.error)) {
      skipChildAchievementsTable = true;
    }
    return null;
  }

  let catRes = await supabase
    .from("achievements")
    .select("*")
    .is("child_id", null)
    .order("points_required", { ascending: true });
  if (
    catRes.error ||
    !(catRes.data?.length ?? 0)
  ) {
    catRes = await supabase
      .from("achievements")
      .select("*")
      .order("points_required", { ascending: true })
      .limit(300);
  }

  const catalogRaw = (catRes.data ?? []) as Record<string, unknown>[];
  const catalog: CatalogAchievement[] = catalogRaw.map((a) => ({
    id: String(a.id),
    name: a.name != null ? String(a.name) : undefined,
    title: a.title != null ? String(a.title) : undefined,
    description: a.description != null ? String(a.description) : "",
    emoji: a.emoji != null ? String(a.emoji) : "🏆",
    color_hex: a.color_hex != null ? String(a.color_hex) : undefined,
    points_required:
      a.points_required != null ? Number(a.points_required) : undefined,
  }));

  const unlocks: UnlockedRow[] = (unlockRes.data ?? []).map((row) => {
    const u = row as Record<string, unknown>;
    const ach = u.achievements as Record<string, unknown> | null;
    return {
      achievement_id: String(u.achievement_id ?? ""),
      unlocked_at: String(u.unlocked_at ?? ""),
      template: ach
        ? {
            id: String(ach.id ?? ""),
            name: ach.name != null ? String(ach.name) : undefined,
            title: ach.title != null ? String(ach.title) : undefined,
            description:
              ach.description != null ? String(ach.description) : "",
            emoji: ach.emoji != null ? String(ach.emoji) : "🏆",
            color_hex:
              ach.color_hex != null ? String(ach.color_hex) : undefined,
            points_required:
              ach.points_required != null
                ? Number(ach.points_required)
                : undefined,
          }
        : null,
    };
  });

  return { mode: "catalog", catalog, unlocks };
}

/** Conquistas por linha na tabela achievements (schema legado com child_id). */
export async function fetchLegacyAchievements(
  childId: string
): Promise<LegacyAchievementRow[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select(
      "id, title, description, emoji, is_completed, completed_date, created_at"
    )
    .eq("child_id", childId)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("fetchLegacyAchievements", error.message);
    return [];
  }
  return (data ?? []).map((r) => {
    const x = r as Record<string, unknown>;
    return {
      id: String(x.id),
      title: String(x.title ?? ""),
      description: String(x.description ?? ""),
      emoji: String(x.emoji ?? "🏆"),
      is_completed: Boolean(x.is_completed),
      completed_date: x.completed_date ? String(x.completed_date) : null,
      created_at: String(x.created_at ?? ""),
    };
  });
}

export async function countUnlockedAchievements(
  childId: string
): Promise<number | null> {
  if (skipChildAchievementsTable) {
    return countLegacyCompletedAchievements(childId);
  }

  const { count, error } = await supabase
    .from("child_achievements")
    .select("*", { count: "exact", head: true })
    .eq("child_id", childId);

  if (!error && count != null) return count;

  if (error && isChildAchievementsUnavailable(error)) {
    skipChildAchievementsTable = true;
    return countLegacyCompletedAchievements(childId);
  }

  return null;
}

export async function countCatalogAchievementTemplates(): Promise<number> {
  const cat = await supabase
    .from("achievements")
    .select("*", { count: "exact", head: true })
    .is("child_id", null);
  if (!cat.error && cat.count != null) return cat.count;
  const all = await supabase
    .from("achievements")
    .select("*", { count: "exact", head: true });
  if (!all.error && all.count != null) return all.count;
  return 0;
}

export async function resolveAchievementsForChild(childId: string): Promise<
  | { mode: "catalog"; catalog: CatalogAchievement[]; unlocks: UnlockedRow[] }
  | { mode: "legacy"; rows: LegacyAchievementRow[] }
> {
  const catalogState = await fetchCatalogAchievementState(childId);
  if (catalogState !== null) {
    return {
      mode: "catalog",
      catalog: catalogState.catalog,
      unlocks: catalogState.unlocks,
    };
  }
  const legacy = await fetchLegacyAchievements(childId);
  return { mode: "legacy", rows: legacy };
}
