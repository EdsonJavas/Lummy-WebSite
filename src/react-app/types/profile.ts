export type AppRole = "parent" | "child";

export type ChildRow = {
  id: string;
  email: string;
  name: string;
  parentId: string;
  age: number;
  balance: number;
  allowance: number;
  requiresApproval: boolean;
  cpf: string;
};

export type ParentRow = {
  id: string;
  email: string;
  name: string;
  cpf: string;
  balance: number;
  childrenIds: string[];
};

export type AppProfile =
  | { role: "child"; child: ChildRow }
  | { role: "parent"; parent: ParentRow; children: ChildRow[] };
