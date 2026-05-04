"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const marketIndices = [
  { name: "S&P 500", value: "5,123.41", change: "+1.23%", isPositive: true },
  { name: "NASDAQ", value: "16,274.94", change: "+1.85%", isPositive: true },
  { name: "DOW", value: "39,127.14", change: "+0.56%", isPositive: true },
  { name: "VIX", value: "13.42", change: "-5.21%", isPositive: false },
];

const topGainers = [
  { symbol: "SMCI", name: "Super Micro", change: "+12.4%", price: "$1,024.50" },
  { symbol: "ARM", name: "ARM Holdings", change: "+8.7%", price: "$152.30" },
  { symbol: "PLTR", name: "Palantir", change: "+6.2%", price: "$24.80" },
];

const topLosers = [
  { symbol: "MRNA", name: "Moderna", change: "-5.8%", price: "$98.20" },
  { symbol: "PARA", name: "Paramount", change: "-4.2%", price: "$12.45" },
  { symbol: "CVS", name: "CVS Health", change: "-3.1%", price: "$72.30" },
];

export function MarketOverview() {
  return (
    <div className="space-y-6">
      {/* Market Indices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {marketIndices.map((index) => (
          <Card key={index.name}>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">{index.name}</span>
                <span className="text-xl font-bold">{index.value}</span>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    index.isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {index.isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {index.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Movers */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingUp className="h-5 w-5" />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topGainers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div>
                    <span className="font-semibold">{stock.symbol}</span>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{stock.price}</span>
                    <p className="text-sm font-medium text-success">{stock.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <TrendingDown className="h-5 w-5" />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLosers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div>
                    <span className="font-semibold">{stock.symbol}</span>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{stock.price}</span>
                    <p className="text-sm font-medium text-destructive">{stock.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
