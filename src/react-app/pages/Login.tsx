import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { APP_BASE } from "@/react-app/lib/appRoutes";

export default function LoginPage() {
  const { isDark } = useTheme();
  const { signIn, loading, error, session, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from ?? APP_BASE;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session && profile) {
      const dest =
        typeof from === "string" && from.startsWith(APP_BASE) ? from : APP_BASE;
      navigate(dest, { replace: true });
    }
  }, [loading, session, profile, navigate, from]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await signIn(email, password);
    } catch {
      /* erro já em context */
    }
  };

  const bg = isDark
    ? "bg-gray-900 text-white"
    : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900";

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${bg}`}>
      <div
        className={`w-full max-w-md rounded-2xl border p-8 shadow-xl ${
          isDark ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <Link
          to="/"
          className={`inline-block text-sm mb-6 ${
            isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          ← Voltar ao início
        </Link>
        <div className="text-center mb-8 font-poppins">
          <h1 className="text-3xl font-bold mb-2">
            <span className={isDark ? "text-white" : "text-black"}>L</span>
            <span className={isDark ? "text-white" : "text-black"}>u</span>
            <span className="text-lummy-blue">m</span>
            <span className="text-lummy-orange">m</span>
            <span className={isDark ? "text-white" : "text-black"}>y</span>
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Entre com a mesma conta do aplicativo
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {(error || localError) && (
            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {localError || error}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lummy-blue/40 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-200"
              }`}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lummy-blue/40 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-200"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-lummy-blue text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p
          className={`mt-6 text-center text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Novo responsável?{" "}
          <Link
            to="/cadastro"
            className="text-lummy-blue font-medium hover:underline"
          >
            Criar conta
          </Link>
        </p>
        <p className={`mt-3 text-center text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Contas de filhos usam o cadastro pelo app com o convite do responsável.
        </p>
      </div>
    </div>
  );
}
