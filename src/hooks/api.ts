"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  alertsApi,
  stocksApi,
  watchlistApi,
} from "@/lib/api/endpoints";
import type {
  CreateAlertInput,
  RiskTolerance,
  TimeHorizon,
} from "@/lib/api/types";

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
  return useQuery({
    queryKey: ["stocks", "analysis", symbol, context],
    queryFn: () => stocksApi.analysis(symbol as string, context),
    enabled: !!symbol,
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
