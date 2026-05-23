"use client";

import { Star, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useWatchlist, useStockOverview } from "@/hooks/api";

function WatchlistRow({ symbol }: { symbol: string }) {
  const { data: overview, isLoading } = useStockOverview(symbol);
  const quote = overview?.quote;
  const isPositive = (quote?.change ?? 0) >= 0;

  return (
    <Link
      href={`/stock/${symbol}`}
      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{symbol.slice(0, 2)}</span>
        </div>
        <div>
          <span className="font-semibold">{symbol}</span>
          <p className="text-sm text-muted-foreground">{overview?.name ?? symbol}</p>
        </div>
      </div>
      <div className="text-right">
        {isLoading || !quote ? (
          <Skeleton className="h-5 w-16" />
        ) : (
          <>
            <span className="font-medium">${quote.price.toFixed(2)}</span>
            <p
              className={`text-sm font-medium flex items-center justify-end gap-1 ${
                isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? "+" : ""}
              {quote.changePercent.toFixed(2)}%
            </p>
          </>
        )}
      </div>
    </Link>
  );
}

export function WatchlistWidget() {
  const { data: symbols, isLoading } = useWatchlist();
  const list = (symbols ?? []).slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-warning" />
          My Watchlist
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/watchlist">
            <Plus className="h-4 w-4 mr-1" />
            Manage
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}
          {!isLoading && list.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Your watchlist is empty. Add stocks to track them here.
            </p>
          )}
          {list.map((symbol) => (
            <WatchlistRow key={symbol} symbol={symbol} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
