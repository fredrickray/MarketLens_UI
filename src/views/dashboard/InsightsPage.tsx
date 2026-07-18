"use client";

import { Brain, TrendingUp, TrendingDown, Minus, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { stocksApi } from "@/lib/api/endpoints";
import { useAnalysisPreferences, useWatchlist } from "@/hooks/api";
import type { RecommendationAction, StockAnalysis } from "@/lib/api/types";

const FALLBACK = ["NVDA", "AAPL", "TSLA", "MSFT", "META", "GOOGL"];

const actionStyles: Record<
  RecommendationAction,
  { badge: string; icon: typeof TrendingUp; label: string }
> = {
  buy: { badge: "bg-success/10 text-success border-success/20", icon: TrendingUp, label: "Buy" },
  hold: { badge: "bg-warning/10 text-warning border-warning/20", icon: Minus, label: "Hold" },
  avoid: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    icon: TrendingDown,
    label: "Avoid",
  },
};

export default function InsightsPage() {
  const [filter, setFilter] = useState<RecommendationAction | "all">("all");
  const { data: watchlist } = useWatchlist();
  const { preferences, isLoading: prefsLoading } = useAnalysisPreferences();
  const symbols = (watchlist && watchlist.length > 0 ? watchlist : FALLBACK).slice(0, 8);

  const results = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["stocks", "analysis", symbol, preferences],
      queryFn: () => stocksApi.analysis(symbol, preferences),
      staleTime: 60_000,
      enabled: !prefsLoading,
    })),
  });

  const insights = results
    .map((r, i) => ({ symbol: symbols[i], analysis: r.data, loading: r.isLoading }))
    .filter((entry) => entry.loading || entry.analysis);

  const visible = insights.filter(
    (entry) =>
      filter === "all" || (entry.analysis && entry.analysis.recommendation.action === filter),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Insights
          </h1>
          <p className="text-muted-foreground">
            Live AI recommendations across your watchlist.
          </p>
        </div>
        <Select value={filter} onValueChange={(v: RecommendationAction | "all") => setFilter(v)}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Insights</SelectItem>
            <SelectItem value="buy">Buy Only</SelectItem>
            <SelectItem value="hold">Hold Only</SelectItem>
            <SelectItem value="avoid">Avoid Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {visible.map((entry) => {
          if (entry.loading || !entry.analysis) {
            return <Skeleton key={entry.symbol} className="h-40 w-full" />;
          }
          return <InsightCard key={entry.symbol} symbol={entry.symbol} analysis={entry.analysis} />;
        })}
        {visible.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No insights match this filter.</p>
        )}
      </div>
    </div>
  );
}

function InsightCard({ symbol, analysis }: { symbol: string; analysis: StockAnalysis }) {
  const rec = analysis.recommendation;
  const style = actionStyles[rec.action];
  const Icon = style.icon;
  const confidence = Math.round(rec.confidence * 100);

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Link
                href={`/stock/${symbol}`}
                className="text-2xl font-bold hover:text-primary transition-colors"
              >
                {symbol}
              </Link>
              <Badge variant="outline" className={style.badge}>
                <Icon className="h-3 w-3 mr-1" />
                {style.label}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-3">{analysis.overview.name}</p>
            <p className="mb-4">{rec.explanation}</p>
            {analysis.model.features_used && analysis.model.features_used.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {analysis.model.features_used.map((factor) => (
                  <Badge key={factor} variant="secondary">
                    {factor}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center p-4 bg-muted rounded-lg min-w-[120px]">
            <span className="text-sm text-muted-foreground mb-1">Confidence</span>
            <span className="text-3xl font-bold text-primary">{confidence}%</span>
            <div className="w-full bg-muted-foreground/20 rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
