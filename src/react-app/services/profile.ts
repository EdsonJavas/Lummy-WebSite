import { supabase } from "@/react-app/lib/supabase";
import type { AppProfile, ChildRow, ParentRow } from "@/react-app/types/profile";

function parseNum(v: unknown): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseFloat(v) || 0;
  return 0;
}

function mapChild(row: Record<string, unknown>): ChildRow {
  return {
    id: String(row.id),
    email: String(row.email ?? ""),
    name: String(row.nome ?? row.name ?? ""),
    parentId: String(row.responsavel_id ?? ""),
    age: typeof row.idade === "number" ? row.idade : 0,
    balance: parseNum(row.balance),
    allowance: parseNum(row.allowance),
    requiresApproval: Boolean(row.requires_approval ?? true),
    cpf: String(row.cpf ?? ""),
  };
}

export async function fetchProfile(userId: string): Promise<AppProfile | null> {
  const { data: childData, error: childErr } = await supabase
    .from("children")
    .select(
      "id,email,nome,responsavel_id,idade,balance,allowance,requires_approval,cpf"
    )
    .eq("id", userId)
    .maybeSingle();

  if (childErr) console.warn("children lookup", childErr.message);
  if (childData) {
    return { role: "child", child: mapChild(childData as Record<string, unknown>) };
  }

  const { data: parentData, error: parentErr } = await supabase
    .from("responsaveis")
    .select("id,email,nome,cpf,balance")
    .eq("id", userId)
    .maybeSingle();

  if (parentErr) console.warn("responsaveis lookup", parentErr.message);
  if (!parentData) return null;

  const { data: childrenRows, error: chErr } = await supabase
    .from("children")
    .select(
      "id,email,nome,responsavel_id,idade,balance,allowance,requires_approval,cpf"
    )
    .eq("responsavel_id", userId);

  if (chErr) console.warn("children list", chErr.message);

  const children = (childrenRows ?? []).map((r) =>
    mapChild(r as Record<string, unknown>)
  );

  const p = parentData as Record<string, unknown>;
  const parent: ParentRow = {
    id: String(p.id),
    email: String(p.email ?? ""),
    name: String(p.nome ?? ""),
    cpf: String(p.cpf ?? ""),
    balance: parseNum(p.balance),
    childrenIds: children.map((c) => c.id),
  };

  return { role: "parent", parent, children };
}
