"use client";

import { useState } from "react";
import { Search, BarChart3, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const recentAnalyses = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: "$878.35",
    change: "+4.12%",
    isPositive: true,
    rating: "Strong Buy",
    ratingType: "bullish" as const,
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "$178.72",
    change: "+2.34%",
    isPositive: true,
    rating: "Hold",
    ratingType: "neutral" as const,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: "$175.21",
    change: "-1.87%",
    isPositive: false,
    rating: "Sell",
    ratingType: "bearish" as const,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: "$425.22",
    change: "+1.15%",
    isPositive: true,
    rating: "Buy",
    ratingType: "bullish" as const,
  },
];

const popularStocks = [
  "AAPL", "NVDA", "TSLA", "MSFT", "META", "GOOGL", "AMZN", "AMD"
];

const ratingStyles = {
  bullish: "bg-success/10 text-success border-success/20",
  neutral: "bg-warning/10 text-warning border-warning/20",
  bearish: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AnalysisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stock/${searchQuery.toUpperCase()}`);
    }
  };

  const handleQuickSearch = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          Stock Analysis
        </h1>
        <p className="text-muted-foreground">
          Search for any stock to get detailed analysis and insights.
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
              {popularStocks.map((symbol) => (
                <Button
                  key={symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSearch(symbol)}
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
          <CardTitle>Recent Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyses.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => handleQuickSearch(stock.symbol)}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">
                      {stock.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{stock.symbol}</span>
                      <Badge variant="outline" className={ratingStyles[stock.ratingType]}>
                        {stock.rating}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
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
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
