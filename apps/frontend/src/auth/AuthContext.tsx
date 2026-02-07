import React from "react";
import http from "../api/http"; // <-- adjust path if needed

export type OnboardingState = {
  needsSponsorshipCode?: boolean;
  mustResetPassword?: boolean;
};

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  onboarding?: OnboardingState;
};

type AuthStatus = "loading" | "ready";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<AuthStatus>("loading");
  const [user, setUser] = React.useState<AuthUser | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("profile");

      if (!token || !stored) {
        setUser(null);
        return;
      }

      setUser(JSON.parse(stored));
    } finally {
      setStatus("ready");
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const login = React.useCallback(async (email: string, password: string) => {
    const { data } = await http.post("/auth/login", { email, password });

    if (!data?.ok) {
      throw new Error(data?.error ?? "Login failed.");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("profile", JSON.stringify(data.profile));

    setUser(data.profile as AuthUser);
    setStatus("ready");
  }, []);

  const logout = React.useCallback(async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setUser(null);
  }, []);

  const value: AuthContextValue = { status, user, refresh, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
