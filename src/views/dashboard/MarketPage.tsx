"use client";

import { TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { stocksApi } from "@/lib/api/endpoints";
import type { StockOverview } from "@/lib/api/types";

const ACTIVE_BASKET = [
  "NVDA", "TSLA", "AAPL", "AMD", "META", "MSFT", "GOOGL", "AMZN", "INTC", "NFLX",
];

// Sector and earnings data are illustrative — the API does not expose these feeds.
const sectors = [
  { name: "Technology", change: "+2.4%", isPositive: true, stocks: 142 },
  { name: "Healthcare", change: "+1.2%", isPositive: true, stocks: 89 },
  { name: "Financials", change: "+0.8%", isPositive: true, stocks: 76 },
  { name: "Consumer", change: "-0.5%", isPositive: false, stocks: 54 },
  { name: "Energy", change: "-1.2%", isPositive: false, stocks: 42 },
  { name: "Real Estate", change: "+0.3%", isPositive: true, stocks: 38 },
];

const upcomingEarnings = [
  { symbol: "NVDA", name: "NVIDIA", date: "Feb 21", time: "After Close" },
  { symbol: "WMT", name: "Walmart", date: "Feb 20", time: "Before Open" },
  { symbol: "HD", name: "Home Depot", date: "Feb 20", time: "Before Open" },
  { symbol: "BKNG", name: "Booking Holdings", date: "Feb 22", time: "After Close" },
];

function formatVolume(value?: number): string {
  if (!value) return "—";
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return `${value}`;
}

export default function MarketPage() {
  const results = useQueries({
    queries: ACTIVE_BASKET.map((symbol) => ({
      queryKey: ["stocks", "overview", symbol],
      queryFn: () => stocksApi.overview(symbol),
      staleTime: 60_000,
    })),
  });

  const loading = results.some((r) => r.isLoading);
  const mostActive = results
    .map((r) => r.data)
    .filter((d): d is StockOverview => !!d)
    .sort((a, b) => (b.quote.volume ?? 0) - (a.quote.volume ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-muted-foreground">Real-time quotes and sector performance.</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Most Active</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="earnings">Earnings Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Most Active Stocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading &&
                  [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                {!loading &&
                  mostActive.map((stock, index) => {
                    const isPositive = stock.quote.changePercent >= 0;
                    return (
                      <Link
                        key={stock.symbol}
                        href={`/stock/${stock.symbol}`}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                          <div>
                            <span className="font-semibold">{stock.symbol}</span>
                            <p className="text-sm text-muted-foreground">{stock.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className="text-sm text-muted-foreground">Volume</span>
                            <p className="font-medium">{formatVolume(stock.quote.volume)}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">${stock.quote.price.toFixed(2)}</span>
                            <p
                              className={`text-sm font-medium ${
                                isPositive ? "text-success" : "text-destructive"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {stock.quote.changePercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors" className="mt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Sector performance is illustrative and not yet wired to a live data source.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector) => (
              <Card key={sector.name}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{sector.name}</h3>
                      <p className="text-sm text-muted-foreground">{sector.stocks} stocks</p>
                    </div>
                    <span
                      className={`text-lg font-bold flex items-center gap-1 ${
                        sector.isPositive ? "text-success" : "text-destructive"
                      }`}
                    >
                      {sector.isPositive ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                      {sector.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="mt-4">
          <p className="mb-4 text-sm text-muted-foreground">
            Earnings dates are illustrative and not yet wired to a live data source.
          </p>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEarnings.map((earning) => (
                  <Link
                    key={earning.symbol}
                    href={`/stock/${earning.symbol}`}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{earning.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <span className="font-semibold">{earning.symbol}</span>
                        <p className="text-sm text-muted-foreground">{earning.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{earning.date}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{earning.time}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
