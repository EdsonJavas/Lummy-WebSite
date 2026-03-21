import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/react-app/hooks/useTheme";
import { AuthProvider } from "@/react-app/context/AuthContext";
import ProtectedRoute from "@/react-app/components/ProtectedRoute";
import AppShell from "@/react-app/components/AppShell";
import HomePage from "@/react-app/pages/HomePage";
import LoginPage from "@/react-app/pages/Login";
import RegisterPage from "@/react-app/pages/Register";
import DashboardPage from "@/react-app/pages/Dashboard";
import MissionsPage from "@/react-app/pages/MissionsPage";
import AchievementsPage from "@/react-app/pages/AchievementsPage";
import GoalsPage from "@/react-app/pages/GoalsPage";
import TransactionsPage from "@/react-app/pages/TransactionsPage";
import ContactPage from "@/react-app/pages/Contact";
import { APP_BASE } from "@/react-app/lib/appRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path={APP_BASE} element={<AppShell />}>
                <Route index element={<DashboardPage />} />
                <Route path="missoes" element={<MissionsPage />} />
                <Route path="conquistas" element={<AchievementsPage />} />
                <Route path="metas" element={<GoalsPage />} />
                <Route path="extrato" element={<TransactionsPage />} />
                <Route path="contato" element={<ContactPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
