"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  alertsApi,
  preferencesApi,
  stocksApi,
  watchlistApi,
} from "@/lib/api/endpoints";
import { useAuth } from "@/lib/auth/auth-context";
import type {
  CreateAlertInput,
  Preferences,
  RiskTolerance,
  TimeHorizon,
} from "@/lib/api/types";

const DEFAULT_PREFS: Preferences = {
  time_horizon: "medium",
  risk_tolerance: "medium",
};

/** Loads saved analysis preferences for the signed-in user or guest session. */
export function useAnalysisPreferences() {
  const { user, isLoading: authLoading } = useAuth();

  const query = useQuery({
    queryKey: ["preferences", user?.id ?? "guest"],
    queryFn: async (): Promise<Preferences> => {
      if (user) {
        return preferencesApi.getUser();
      }
      const guestPrefs = await preferencesApi.getGuest();
      return guestPrefs ?? DEFAULT_PREFS;
    },
    enabled: !authLoading,
    staleTime: 60_000,
  });

  return {
    preferences: query.data ?? DEFAULT_PREFS,
    isLoading: authLoading || query.isLoading,
  };
}

export function useStockSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ["stocks", "search", query],
    queryFn: () => stocksApi.search(query),
    enabled: enabled && query.trim().length > 0,
  });
}

export function useStockOverview(symbol: string | undefined) {
  return useQuery({
    queryKey: ["stocks", "overview", symbol],
    queryFn: () => stocksApi.overview(symbol as string),
    enabled: !!symbol,
  });
}

export function useStockAnalysis(
  symbol: string | undefined,
  context?: { time_horizon?: TimeHorizon; risk_tolerance?: RiskTolerance },
) {
  const { preferences, isLoading: prefsLoading } = useAnalysisPreferences();
  const resolved = context ?? {
    time_horizon: preferences.time_horizon,
    risk_tolerance: preferences.risk_tolerance,
  };

  return useQuery({
    queryKey: ["stocks", "analysis", symbol, resolved],
    queryFn: () => stocksApi.analysis(symbol as string, resolved),
    enabled: !!symbol && !prefsLoading,
  });
}

export function useStockHistory(symbol: string | undefined, days = 90) {
  return useQuery({
    queryKey: ["stocks", "history", symbol, days],
    queryFn: () => stocksApi.history(symbol as string, days),
    enabled: !!symbol,
    retry: false,
  });
}

export function useStockNews(
  symbol: string | undefined,
  params?: { days?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["stocks", "news", symbol, params],
    queryFn: () => stocksApi.news(symbol as string, params),
    enabled: !!symbol,
  });
}

export function useWatchlist() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: () => watchlistApi.list(),
  });
}

export function useAddToWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => watchlistApi.add(symbol),
    onSuccess: (symbols) => qc.setQueryData(["watchlist"], symbols),
  });
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (symbol: string) => watchlistApi.remove(symbol),
    onSuccess: (symbols) => qc.setQueryData(["watchlist"], symbols),
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],
    queryFn: () => alertsApi.list(),
  });
}

export function useCreateAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAlertInput) => alertsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useSetAlertActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      alertsApi.setActive(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useDeleteAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}
