"use client";

import { Brain, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { stocksApi } from "@/lib/api/endpoints";
import { useWatchlist } from "@/hooks/api";
import type { RecommendationAction } from "@/lib/api/types";

const FALLBACK = ["NVDA", "AAPL", "TSLA"];

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

export function AIInsightsWidget() {
  const { data: watchlist } = useWatchlist();
  const symbols = (watchlist && watchlist.length > 0 ? watchlist : FALLBACK).slice(0, 3);

  const results = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["stocks", "analysis", symbol, undefined],
      queryFn: () => stocksApi.analysis(symbol),
      staleTime: 60_000,
    })),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/insights">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result, i) => {
            const symbol = symbols[i];
            if (result.isLoading || !result.data) {
              return <Skeleton key={symbol} className="h-24 w-full" />;
            }
            const rec = result.data.recommendation;
            const style = actionStyles[rec.action];
            const Icon = style.icon;
            return (
              <Link
                key={symbol}
                href={`/stock/${symbol}`}
                className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{symbol}</span>
                    <Badge variant="outline" className={style.badge}>
                      <Icon className="h-3 w-3 mr-1" />
                      {style.label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <p className="font-bold text-primary">
                      {Math.round(rec.confidence * 100)}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{rec.explanation}</p>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
