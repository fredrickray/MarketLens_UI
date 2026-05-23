"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, guestApi } from "@/lib/api/endpoints";
import { getToken, setToken } from "@/lib/api/client";
import type { AuthResponse, AuthUser } from "@/lib/api/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<{ message: string; email: string }>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  applyAuth: (res: AuthResponse) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function ensureGuestSession(): Promise<void> {
  try {
    const current = await guestApi.me();
    if (!current.data) {
      await guestApi.createSession();
    }
  } catch {
    // Guest session is best-effort; ignore failures.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const token = getToken();
      if (token) {
        try {
          const me = await authApi.me();
          if (active) setUser(me);
        } catch {
          setToken(null);
          if (active) setUser(null);
          await ensureGuestSession();
        }
      } else {
        await ensureGuestSession();
      }
      if (active) setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const applyAuth = useCallback((res: AuthResponse) => {
    setToken(res.accessToken);
    setUser(res.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.signin({ email, password });
      applyAuth(res);
    },
    [applyAuth],
  );

  const signup = useCallback(
    (input: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => authApi.signup(input),
    [],
  );

  const verifyEmail = useCallback(
    async (email: string, otp: string) => {
      const res = await authApi.verifyEmail({ email, otp });
      applyAuth(res);
    },
    [applyAuth],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setToken(null);
      setUser(null);
      await ensureGuestSession();
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      verifyEmail,
      logout,
      applyAuth,
    }),
    [user, isLoading, login, signup, verifyEmail, logout, applyAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
