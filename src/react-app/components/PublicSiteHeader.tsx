import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { APP_BASE } from "@/react-app/lib/appRoutes";

export default function PublicSiteHeader() {
  const { isDark, toggleTheme } = useTheme();
  const { session, profile, loading } = useAuth();
  const authed = Boolean(session && profile);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 border-b ${
        isDark
          ? "bg-gray-900/85 border-gray-800"
          : "bg-white/90 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="text-2xl font-bold font-poppins shrink-0"
          aria-label="Lummy — início"
        >
          <span className={isDark ? "text-white" : "text-black"}>L</span>
          <span className={isDark ? "text-white" : "text-black"}>u</span>
          <span className="text-lummy-blue">m</span>
          <span className="text-lummy-orange">m</span>
          <span className={isDark ? "text-white" : "text-black"}>y</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
            aria-label="Alternar tema"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {!loading && authed ? (
            <Link
              to={APP_BASE}
              className="px-4 py-2 rounded-xl bg-lummy-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Acessar painel
            </Link>
          ) : (
            <>
              <Link
                to="/cadastro"
                className={`hidden sm:inline text-sm font-medium px-3 py-2 rounded-xl transition-colors ${
                  isDark
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Criar conta
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-lummy-blue text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
