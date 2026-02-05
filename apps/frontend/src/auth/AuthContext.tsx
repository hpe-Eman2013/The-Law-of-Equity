import React from "react";

export type OnboardingState = {
  needsSponsorshipCode?: boolean;
  mustResetPassword?: boolean;
};

export type AuthUser = {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  onboarding?: OnboardingState;
};

type AuthStatus = "loading" | "ready";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  refresh: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

function isNotFoundOrUnauthorized(status: number) {
  return status === 401 || status === 403 || status === 404;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [user, setUser] = React.useState<AuthUser | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });

      if (isNotFoundOrUnauthorized(res.status)) {
        setUser(null);
        setStatus("ready");
        return;
      }

      const json = await res.json();
      // Expecting: { ok:true, data:{ user } } or { ok:false,... }
      if (json?.ok && json.data?.user) {
        setUser(json.data.user as AuthUser);
      } else {
        setUser(null);
      }
    } catch {
      // If backend isn't up, don't block UI
      setUser(null);
    } finally {
      setStatus("ready");
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const login = React.useCallback(async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      const msg = json?.error?.message ?? `${res.status} ${res.statusText}`;
      throw new Error(msg);
    }

    // Prefer server returning the user payload
    if (json.data?.user) setUser(json.data.user as AuthUser);
    else await refresh();
  }, [refresh]);

  const logout = React.useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
    }
  }, []);

  const value: AuthContextValue = { status, user, refresh, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
