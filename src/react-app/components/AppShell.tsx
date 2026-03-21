import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  MessageCircle,
  PanelLeftClose,
  PanelLeft,
  Target,
  Trophy,
  Flag,
  ListOrdered,
} from "lucide-react";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { SelectedChildProvider } from "@/react-app/context/SelectedChildContext";
import ChildPickerBar from "@/react-app/components/ChildPickerBar";
import AppTopNav from "@/react-app/components/AppTopNav";
import { APP_BASE, appRoute } from "@/react-app/lib/appRoutes";

const linkClass = ({
  isActive,
  isDark,
}: {
  isActive: boolean;
  isDark: boolean;
}) => {
  const base =
    "flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-all duration-200";
  if (isActive) {
    return `${base} ${
      isDark
        ? "bg-gradient-to-r from-[#4A90E2]/25 via-[#8B5CF6]/18 to-transparent text-white shadow-[0_0_16px_rgba(74,144,226,0.12)] ring-1 ring-[#4A90E2]/35"
        : "bg-gradient-to-r from-[#4A90E2]/18 via-[#8B5CF6]/12 to-[#FF8C42]/08 text-[#1e3a5f] shadow-sm ring-1 ring-[#4A90E2]/25"
    }`;
  }
  return `${base} ${
    isDark
      ? "text-gray-400 hover:bg-white/[0.06] hover:text-white"
      : "text-slate-600 hover:bg-[#4A90E2]/10 hover:text-[#2563eb]"
  }`;
};

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark } = useTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const shellBg = isDark
    ? "bg-[#0b0f1a] text-white"
    : "bg-[#e8eef8] text-gray-900";

  const sidebarBg = isDark
    ? "bg-[#0f1419] border-white/[0.06] shadow-[4px_0_24px_rgba(0,0,0,0.35)]"
    : "border-[#c5d5ef]/70 bg-gradient-to-b from-[#f7f9ff] to-[#eef3fc] shadow-[4px_0_20px_rgba(74,144,226,0.08)]";

  const widthOpen = "w-[17.5rem]";
  const widthCollapsed = "w-[4.5rem]";
  const widthCls = open ? widthOpen : widthCollapsed;
  const mainOffset = open ? "md:ml-[17.5rem]" : "md:ml-[4.5rem]";

  const iconClass = "h-5 w-5 shrink-0 stroke-[1.6]";

  return (
    <div
      className={`h-screen overflow-hidden transition-colors duration-300 ${shellBg}`}
    >
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-label="Fechar menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r ${sidebarBg} ${widthCls} transition-all duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div
          className={`flex h-[3.25rem] shrink-0 items-center gap-2 border-b px-2.5 sm:h-14 ${
            isDark ? "border-white/[0.06]" : "border-[#4A90E2]/12"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className={`hidden rounded-lg p-2 md:flex ${
              isDark
                ? "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                : "text-[#4A90E2] hover:bg-[#4A90E2]/12"
            }`}
            aria-label={open ? "Recolher menu" : "Expandir menu"}
          >
            {open ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-[#4A90E2] md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
          {open && (
            <span className="font-poppins text-lg font-bold tracking-tight">
              <span className={isDark ? "text-white" : "text-slate-800"}>L</span>
              <span className={isDark ? "text-white" : "text-slate-800"}>u</span>
              <span className="text-[#4A90E2]">m</span>
              <span className="text-[#FF8C42]">m</span>
              <span className={isDark ? "text-white" : "text-slate-800"}>y</span>
            </span>
          )}
        </div>

        <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-contain px-2 py-3">
          <NavLink
            to={APP_BASE}
            end
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => linkClass({ isActive, isDark })}
            title="Dashboard"
          >
            <LayoutDashboard className={iconClass} />
            {open && <span>Dashboard</span>}
          </NavLink>
          <NavLink
            to={appRoute("missoes")}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => linkClass({ isActive, isDark })}
            title="Missões"
          >
            <Target className={iconClass} />
            {open && <span>Missões</span>}
          </NavLink>
          <NavLink
            to={appRoute("conquistas")}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => linkClass({ isActive, isDark })}
            title="Conquistas"
          >
            <Trophy className={iconClass} />
            {open && <span>Conquistas</span>}
          </NavLink>
          <NavLink
            to={appRoute("metas")}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => linkClass({ isActive, isDark })}
            title="Metas"
          >
            <Flag className={iconClass} />
            {open && <span>Metas</span>}
          </NavLink>
          <NavLink
            to={appRoute("extrato")}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => linkClass({ isActive, isDark })}
            title="Extrato"
          >
            <ListOrdered className={iconClass} />
            {open && <span>Extrato</span>}
          </NavLink>
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => linkClass({ isActive, isDark })}
            title="Site / Download"
          >
            <Home className={iconClass} />
            {open && <span>Site / Download</span>}
          </NavLink>
          <NavLink
            to={appRoute("contato")}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => linkClass({ isActive, isDark })}
            title="Contato"
          >
            <MessageCircle className={iconClass} />
            {open && <span>Contato</span>}
          </NavLink>
        </nav>
      </aside>

      <div
        className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden transition-[margin] duration-300 ease-out ${mainOffset}`}
      >
        <SelectedChildProvider>
          <AppTopNav
            isDark={isDark}
            onOpenMobileMenu={() => setMobileOpen(true)}
            onLogout={handleLogout}
          />
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-8">
            <ChildPickerBar />
            <Outlet />
          </main>
        </SelectedChildProvider>
      </div>
    </div>
  );
}
