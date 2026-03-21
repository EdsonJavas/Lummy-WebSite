/** Alinha com o app mobile: metas em andamento usam `ongoing`; schema SQL antigo usa `active`. */

export function goalIsInProgress(status: string): boolean {
  const s = status.toLowerCase().trim();
  return s === "ongoing" || s === "active";
}

export function goalIsCompleted(status: string): boolean {
  return status.toLowerCase().trim() === "completed";
}

export function goalIsCancelled(status: string): boolean {
  const s = status.toLowerCase().trim();
  return s === "cancelled" || s === "canceled";
}

export type GoalRowLike = {
  status: string;
  completed_at?: string | null;
  target_amount?: number;
  current_amount?: number;
};

/** Concluída no banco OU com `completed_at` preenchido OU progresso ≥ 100% (dados legados / sync). */
export function goalRowIsCompleted(r: GoalRowLike): boolean {
  if (goalIsCancelled(r.status)) return false;
  if (goalIsCompleted(r.status)) return true;
  const ca = r.completed_at;
  if (ca != null && String(ca).trim() !== "") return true;
  const t = Number(r.target_amount) || 0;
  const c = Number(r.current_amount) || 0;
  return t > 0 && c >= t;
}

export function goalRowIsCancelled(r: GoalRowLike): boolean {
  return goalIsCancelled(r.status);
}

/** Em andamento: não cancelada e não tratada como concluída pela linha. */
export function goalRowIsInProgress(r: GoalRowLike): boolean {
  if (goalRowIsCancelled(r)) return false;
  if (goalRowIsCompleted(r)) return false;
  return true;
}

export function goalStatusLabel(status: string): string {
  if (goalIsCompleted(status)) return "Concluída";
  if (goalIsCancelled(status)) return "Cancelada";
  if (goalIsInProgress(status)) return "Em andamento";
  return status;
}

export function goalRowStatusLabel(r: GoalRowLike): string {
  if (goalRowIsCancelled(r)) return "Cancelada";
  if (goalRowIsCompleted(r)) return "Concluída";
  if (goalIsInProgress(r.status)) return "Em andamento";
  return r.status || "—";
}
