import { apiRequest } from "./client";
import type {
  Alert,
  AuthResponse,
  AuthUser,
  CreateAlertInput,
  NewsFeed,
  Preferences,
  StockAnalysis,
  StockOverview,
  StockSearchResult,
  TimeHorizon,
  RiskTolerance,
} from "./types";

interface Wrapped<T> {
  data: T;
}

// ---- Auth ----------------------------------------------------------------

export const authApi = {
  signup: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) =>
    apiRequest<{ message: string; email: string }>("/auth/signup", {
      method: "POST",
      body: input,
      auth: false,
    }),

  verifyEmail: (input: { email: string; otp: string }) =>
    apiRequest<AuthResponse>("/auth/verify-email", {
      method: "POST",
      body: input,
      auth: false,
    }),

  resendOtp: (email: string) =>
    apiRequest<{ message: string }>("/auth/resend-otp", {
      method: "POST",
      body: { email },
      auth: false,
    }),

  signin: (input: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/signin", {
      method: "POST",
      body: input,
      auth: false,
    }),

  exchangeOAuth: (code: string) =>
    apiRequest<AuthResponse>("/auth/oauth/exchange", {
      method: "POST",
      body: { code },
      auth: false,
    }),

  logout: () => apiRequest<void>("/auth/logout", { method: "POST", auth: false }),

  me: () => apiRequest<AuthUser>("/auth/me"),

  mergeGuest: () =>
    apiRequest<{ merged: boolean }>("/auth/merge-guest", { method: "POST" }),
};

// ---- Preferences (user / guest) -----------------------------------------

export const preferencesApi = {
  getUser: () =>
    apiRequest<Wrapped<Preferences>>("/users/me/preferences").then((r) => r.data),

  updateUser: (input: Partial<Preferences>) =>
    apiRequest<Wrapped<Preferences>>("/users/me/preferences", {
      method: "PATCH",
      body: input,
    }).then((r) => r.data),
};

export const guestApi = {
  createSession: () =>
    apiRequest<Wrapped<{ guestId: string; expiresAt: string; preferences: Preferences }>>(
      "/guest/session",
      { method: "POST", auth: false },
    ),

  me: () =>
    apiRequest<Wrapped<{ guestId: string; expiresAt: string; preferences: Preferences } | null>>(
      "/guest/me",
      { auth: false },
    ),
};

// ---- Stocks --------------------------------------------------------------

export const stocksApi = {
  search: (q: string, limit = 10) =>
    apiRequest<{ data: StockSearchResult[] }>("/stocks/search", {
      query: { q, limit },
      auth: false,
    }).then((r) => r.data),

  overview: (symbol: string) =>
    apiRequest<{ data: StockOverview }>(`/stocks/${encodeURIComponent(symbol)}/overview`, {
      auth: false,
    }).then((r) => r.data),

  analysis: (
    symbol: string,
    context?: { time_horizon?: TimeHorizon; risk_tolerance?: RiskTolerance },
  ) =>
    apiRequest<{ data: StockAnalysis }>(`/stocks/${encodeURIComponent(symbol)}/analysis`, {
      query: context,
    }).then((r) => r.data),

  news: (symbol: string, params?: { days?: number; limit?: number }) =>
    apiRequest<{ data: NewsFeed }>(`/stocks/${encodeURIComponent(symbol)}/news`, {
      query: params,
      auth: false,
    }).then((r) => r.data),
};

// ---- Watchlist (user or guest) ------------------------------------------

export const watchlistApi = {
  list: () =>
    apiRequest<{ data: { symbols: string[] } }>("/watchlist").then(
      (r) => r.data.symbols,
    ),

  add: (symbol: string) =>
    apiRequest<{ data: { symbols: string[] } }>("/watchlist", {
      method: "POST",
      body: { symbol },
    }).then((r) => r.data.symbols),

  remove: (symbol: string) =>
    apiRequest<{ data: { symbols: string[] } }>(
      `/watchlist/${encodeURIComponent(symbol)}`,
      { method: "DELETE" },
    ).then((r) => r.data.symbols),
};

// ---- Alerts (JWT required) ----------------------------------------------

export const alertsApi = {
  list: () =>
    apiRequest<{ data: Alert[] }>("/alerts").then((r) => r.data),

  create: (input: CreateAlertInput) =>
    apiRequest<{ data: Alert }>("/alerts", { method: "POST", body: input }).then(
      (r) => r.data,
    ),

  setActive: (id: string, isActive: boolean) =>
    apiRequest<{ data: Alert }>(`/alerts/${id}`, {
      method: "PATCH",
      body: { isActive },
    }).then((r) => r.data),

  remove: (id: string) =>
    apiRequest<{ data: { id: string; deleted: boolean } }>(`/alerts/${id}`, {
      method: "DELETE",
    }).then((r) => r.data),
};
