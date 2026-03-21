/** Prefixo de todas as rotas autenticadas (painel). */
export const APP_BASE = "/app";

export function appRoute(path: string): string {
  const p = path.replace(/^\//, "");
  return p ? `${APP_BASE}/${p}` : APP_BASE;
}
