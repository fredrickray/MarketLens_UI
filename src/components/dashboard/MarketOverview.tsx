"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { stocksApi } from "@/lib/api/endpoints";
import type { StockOverview } from "@/lib/api/types";

const INDICES: { symbol: string; label: string }[] = [
  { symbol: "^GSPC", label: "S&P 500" },
  { symbol: "^IXIC", label: "NASDAQ" },
  { symbol: "^DJI", label: "DOW" },
  { symbol: "^VIX", label: "VIX" },
];

const MOVERS_BASKET = [
  "AAPL", "NVDA", "TSLA", "MSFT", "META", "GOOGL", "AMZN", "AMD", "NFLX", "INTC",
];

function useOverviews(symbols: string[]) {
  return useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["stocks", "overview", symbol],
      queryFn: () => stocksApi.overview(symbol),
      staleTime: 60_000,
    })),
  });
}

export function MarketOverview() {
  const indexResults = useOverviews(INDICES.map((i) => i.symbol));
  const moverResults = useOverviews(MOVERS_BASKET);

  const movers = moverResults
    .map((r) => r.data)
    .filter((d): d is StockOverview => !!d)
    .sort((a, b) => b.quote.changePercent - a.quote.changePercent);

  const gainers = movers.slice(0, 3);
  const losers = movers.slice(-3).reverse();
  const moversLoading = moverResults.some((r) => r.isLoading);

  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {INDICES.map((index, i) => {
          const result = indexResults[i];
          const quote = result?.data?.quote;
          const isPositive = (quote?.changePercent ?? 0) >= 0;
          return (
            <Card key={index.symbol}>
              <CardContent className="pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">{index.label}</span>
                  {result?.isLoading || !quote ? (
                    <Skeleton className="h-7 w-20" />
                  ) : (
                    <>
                      <span className="text-xl font-bold">
                        {quote.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span
                        className={`text-sm font-medium flex items-center gap-1 ${
                          isPositive ? "text-success" : "text-destructive"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {isPositive ? "+" : ""}
                        {quote.changePercent.toFixed(2)}%
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Top Movers */}
      <div className="grid md:grid-cols-2 gap-6">
        <MoversCard title="Top Gainers" positive items={gainers} loading={moversLoading} />
        <MoversCard title="Top Losers" positive={false} items={losers} loading={moversLoading} />
      </div>
    </div>
  );
}

function MoversCard({
  title,
  positive,
  items,
  loading,
}: {
  title: string;
  positive: boolean;
  items: StockOverview[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className={`flex items-center gap-2 ${positive ? "text-success" : "text-destructive"}`}
        >
          {positive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading &&
            [0, 1, 2].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
          {!loading &&
            items.map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <span className="font-semibold">{stock.symbol}</span>
                  <p className="text-sm text-muted-foreground truncate max-w-[10rem]">
                    {stock.name}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-medium">${stock.quote.price.toFixed(2)}</span>
                  <p
                    className={`text-sm font-medium ${
                      stock.quote.changePercent >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stock.quote.changePercent >= 0 ? "+" : ""}
                    {stock.quote.changePercent.toFixed(2)}%
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
