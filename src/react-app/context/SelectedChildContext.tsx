import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/react-app/context/AuthContext";
import type { ChildRow } from "@/react-app/types/profile";

const STORAGE_PREFIX = "lummy-web-selected-child:";

function storageKeyForParent(parentId: string) {
  return `${STORAGE_PREFIX}${parentId}`;
}

type SelectedChildContextValue = {
  selectedChildId: string | null;
  setSelectedChildId: (id: string) => void;
  selectedChild: ChildRow | null;
};

const SelectedChildContext = createContext<SelectedChildContextValue | null>(
  null
);

export function SelectedChildProvider({ children }: { children: ReactNode }) {
  const { profile, session } = useAuth();
  const [selectedChildId, setSelectedChildIdState] = useState<string | null>(
    null
  );
  const hadSessionRef = useRef(false);

  useEffect(() => {
    const hasSession = session !== null;
    if (hasSession) hadSessionRef.current = true;
    else if (hadSessionRef.current) {
      hadSessionRef.current = false;
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
        });
      } catch {
        /* ignore */
      }
      setSelectedChildIdState(null);
    }
  }, [session]);

  useEffect(() => {
    if (!profile) return;

    if (profile.role === "child") {
      setSelectedChildIdState(profile.child.id);
      return;
    }

    if (profile.role === "parent") {
      const kids = profile.children;
      if (kids.length === 0) {
        setSelectedChildIdState(null);
        return;
      }

      const key = storageKeyForParent(profile.parent.id);
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(key);
      } catch {
        saved = null;
      }

      const isValid = (id: string | null) =>
        Boolean(id && kids.some((c) => c.id === id));

      if (isValid(saved)) {
        setSelectedChildIdState(saved as string);
        return;
      }

      setSelectedChildIdState((current) => {
        if (isValid(current)) {
          try {
            localStorage.setItem(key, current as string);
          } catch {
            /* ignore */
          }
          return current;
        }
        const first = kids[0].id;
        try {
          localStorage.setItem(key, first);
        } catch {
          /* ignore */
        }
        return first;
      });
    }
  }, [profile]);

  const setSelectedChildId = useCallback(
    (id: string) => {
      setSelectedChildIdState(id);
      if (profile?.role === "parent") {
        try {
          localStorage.setItem(storageKeyForParent(profile.parent.id), id);
        } catch {
          /* ignore */
        }
      }
    },
    [profile]
  );

  const selectedChild = useMemo((): ChildRow | null => {
    if (!profile || !selectedChildId) return null;
    if (profile.role === "child") return profile.child;
    return profile.children.find((c) => c.id === selectedChildId) ?? null;
  }, [profile, selectedChildId]);

  const value = useMemo(
    () => ({
      selectedChildId,
      setSelectedChildId,
      selectedChild,
    }),
    [selectedChildId, setSelectedChildId, selectedChild]
  );

  return (
    <SelectedChildContext.Provider value={value}>
      {children}
    </SelectedChildContext.Provider>
  );
}

export function useSelectedChild() {
  const ctx = useContext(SelectedChildContext);
  if (!ctx) {
    throw new Error("useSelectedChild must be used within SelectedChildProvider");
  }
  return ctx;
}
