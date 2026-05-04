"use client";

import { useState } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: "$178.72", change: "+2.34%", isPositive: true },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "$878.35", change: "+4.12%", isPositive: true },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$175.21", change: "-1.87%", isPositive: false },
  { symbol: "MSFT", name: "Microsoft", price: "$425.22", change: "+1.15%", isPositive: true },
  { symbol: "META", name: "Meta Platforms", price: "$505.95", change: "+3.24%", isPositive: true },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "$156.37", change: "+0.89%", isPositive: true },
  { symbol: "AMZN", name: "Amazon.com", price: "$178.25", change: "+1.45%", isPositive: true },
  { symbol: "AMD", name: "AMD Inc.", price: "$178.50", change: "+5.67%", isPositive: true },
];

export function QuickStockSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStocks = popularStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Quick Stock Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredStocks.slice(0, 8).map((stock) => (
            <Link
              key={stock.symbol}
              href={`/stock/${stock.symbol}`}
              className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">{stock.symbol}</span>
                {stock.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mb-1">{stock.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{stock.price}</span>
                <span
                  className={`text-xs font-medium ${
                    stock.isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {stock.change}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
