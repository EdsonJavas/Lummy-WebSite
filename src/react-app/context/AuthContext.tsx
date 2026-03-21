import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/react-app/lib/supabase";
import { fetchProfile } from "@/react-app/services/profile";
import type { AppProfile } from "@/react-app/types/profile";

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: AppProfile | null;
  loading: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUpParent: (input: {
    email: string;
    password: string;
    name: string;
    cpf?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (uid: string) => {
    setError(null);
    const p = await fetchProfile(uid);
    setProfile(p);
    if (!p) setError("Dados do usuário não encontrados no banco.");
  }, []);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (cancelled) return;
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadProfile(s.user.id).finally(() => {
          if (!cancelled) setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setError(null);
      if (s?.user) {
        setLoading(true);
        loadProfile(s.user.id).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    const { data, error: e } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (e) {
      setLoading(false);
      setError(mapAuthError(e.message));
      throw e;
    }
    if (data.user) await loadProfile(data.user.id);
    setLoading(false);
  }, [loadProfile]);

  const signUpParent = useCallback(
    async (input: {
      email: string;
      password: string;
      name: string;
      cpf?: string;
    }) => {
      setError(null);
      setLoading(true);
      const { data, error: e } = await supabase.auth.signUp({
        email: input.email.trim(),
        password: input.password,
        options: {
          data: { name: input.name, role: "parent" },
        },
      });
      if (e) {
        setLoading(false);
        setError(mapAuthError(e.message));
        throw e;
      }
      const uid = data.user?.id;
      if (!uid) {
        setLoading(false);
        setError("Conta criada; confirme o e-mail se solicitado.");
        return;
      }
      const { error: insErr } = await supabase.from("responsaveis").insert({
        id: uid,
        nome: input.name,
        email: input.email.trim(),
        cpf: input.cpf ?? "",
      });
      if (insErr) {
        setLoading(false);
        setError(insErr.message);
        throw insErr;
      }
      await loadProfile(uid);
      setLoading(false);
    },
    [loadProfile]
  );

  const signOut = useCallback(async () => {
    setError(null);
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    await loadProfile(user.id);
    setLoading(false);
  }, [user?.id, loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      loading,
      error,
      signIn,
      signUpParent,
      signOut,
      refreshProfile,
    }),
    [
      session,
      user,
      profile,
      loading,
      error,
      signIn,
      signUpParent,
      signOut,
      refreshProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function mapAuthError(message: string): string {
  if (message.includes("Invalid login credentials"))
    return "E-mail ou senha incorretos.";
  if (message.includes("Email not confirmed"))
    return "Confirme seu e-mail antes de entrar.";
  if (message.includes("User already registered"))
    return "Este e-mail já está cadastrado.";
  return message;
}
