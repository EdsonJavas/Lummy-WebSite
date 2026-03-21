import { Users } from "lucide-react";
import { useTheme } from "@/react-app/hooks/useTheme";
import { useAuth } from "@/react-app/context/AuthContext";
import { useSelectedChild } from "@/react-app/context/SelectedChildContext";

export default function ChildPickerBar() {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const { selectedChildId, setSelectedChildId } = useSelectedChild();

  if (profile?.role !== "parent" || profile.children.length === 0) {
    return null;
  }

  return (
    <div
      className={`mb-6 flex flex-wrap items-center gap-4 rounded-3xl border p-4 sm:p-5 ${
        isDark
          ? "border-white/[0.08] bg-[#121826]/80 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
          : "border-[#4A90E2]/15 bg-white/95 shadow-sm ring-1 ring-[#4A90E2]/08"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
          isDark ? "bg-lummy-blue/15 text-lummy-blue" : "bg-lummy-blue/10 text-lummy-blue"
        }`}
      >
        <Users className="h-6 w-6 stroke-[1.75]" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? "text-gray-500" : "text-gray-500"
          }`}
        >
          Dependente
        </p>
        <p
          className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          Escolha quem você está acompanhando — a seleção fica salva neste
          dispositivo.
        </p>
      </div>
      <select
        value={selectedChildId ?? ""}
        onChange={(e) => setSelectedChildId(e.target.value)}
        className={`min-w-[200px] rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition-shadow focus:ring-2 focus:ring-[#4A90E2]/35 ${
          isDark
            ? "border-white/10 bg-[#0f1419] text-white"
            : "border-gray-200 bg-gray-50 text-gray-900"
        }`}
      >
        {profile.children.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
