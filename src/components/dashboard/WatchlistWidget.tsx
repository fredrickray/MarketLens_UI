"use client";

import { Star, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const watchlistStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: "$178.72", change: "+2.34%", isPositive: true },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "$878.35", change: "+4.12%", isPositive: true },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$175.21", change: "-1.87%", isPositive: false },
  { symbol: "MSFT", name: "Microsoft", price: "$425.22", change: "+1.15%", isPositive: true },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "$156.37", change: "+0.89%", isPositive: true },
];

export function WatchlistWidget() {
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
          {watchlistStocks.map((stock) => (
            <Link
              key={stock.symbol}
              href={`/stock/${stock.symbol}`}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {stock.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">{stock.symbol}</span>
                  <p className="text-sm text-muted-foreground">{stock.name}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium">{stock.price}</span>
                <p
                  className={`text-sm font-medium flex items-center justify-end gap-1 ${
                    stock.isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {stock.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stock.change}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
