"use client";

import { useState } from "react";
import { Search, BarChart3, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import { stocksApi } from "@/lib/api/endpoints";
import { useWatchlist } from "@/hooks/api";
import type { RecommendationAction, StockAnalysis } from "@/lib/api/types";

const POPULAR = ["AAPL", "NVDA", "TSLA", "MSFT", "META", "GOOGL", "AMZN", "AMD"];

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

export default function AnalysisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: watchlist } = useWatchlist();

  const symbols = (watchlist && watchlist.length > 0 ? watchlist : POPULAR.slice(0, 4)).slice(0, 6);

  const results = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["stocks", "analysis", symbol, undefined],
      queryFn: () => stocksApi.analysis(symbol),
      staleTime: 60_000,
    })),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/stock/${searchQuery.trim().toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Stock Analysis
        </h1>
        <p className="text-muted-foreground">
          Search for any stock to get detailed AI analysis and insights.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter stock symbol (e.g., AAPL, NVDA, TSLA)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">
              Analyze
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>
          <div className="mt-4">
            <span className="text-sm text-muted-foreground mr-2">Popular:</span>
            <div className="inline-flex flex-wrap gap-2">
              {POPULAR.map((symbol) => (
                <Button
                  key={symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/stock/${symbol}`)}
                >
                  {symbol}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{watchlist && watchlist.length > 0 ? "Your Watchlist" : "Popular Analyses"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, i) => {
              const symbol = symbols[i];
              if (result.isLoading || !result.data) {
                return <Skeleton key={symbol} className="h-20 w-full" />;
              }
              return <AnalysisRow key={symbol} symbol={symbol} analysis={result.data} />;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalysisRow({ symbol, analysis }: { symbol: string; analysis: StockAnalysis }) {
  const router = useRouter();
  const rec = analysis.recommendation;
  const style = actionStyles[rec.action];
  const Icon = style.icon;
  const quote = analysis.overview.quote;
  const isPositive = quote.changePercent >= 0;

  return (
    <div
      onClick={() => router.push(`/stock/${symbol}`)}
      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="font-bold text-primary">{symbol.slice(0, 2)}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{symbol}</span>
            <Badge variant="outline" className={style.badge}>
              <Icon className="h-3 w-3 mr-1" />
              {style.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{analysis.overview.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <span className="font-medium">${quote.price.toFixed(2)}</span>
          <p
            className={`text-sm font-medium flex items-center justify-end gap-1 ${
              isPositive ? "text-success" : "text-destructive"
            }`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? "+" : ""}
            {quote.changePercent.toFixed(2)}%
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}
