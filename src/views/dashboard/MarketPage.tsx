"use client";

import { TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const sectors = [
  { name: "Technology", change: "+2.4%", isPositive: true, stocks: 142 },
  { name: "Healthcare", change: "+1.2%", isPositive: true, stocks: 89 },
  { name: "Financials", change: "+0.8%", isPositive: true, stocks: 76 },
  { name: "Consumer", change: "-0.5%", isPositive: false, stocks: 54 },
  { name: "Energy", change: "-1.2%", isPositive: false, stocks: 42 },
  { name: "Real Estate", change: "+0.3%", isPositive: true, stocks: 38 },
];

const mostActive = [
  { symbol: "NVDA", name: "NVIDIA", volume: "85.2M", price: "$878.35", change: "+4.12%" },
  { symbol: "TSLA", name: "Tesla", volume: "72.1M", price: "$175.21", change: "-1.87%" },
  { symbol: "AAPL", name: "Apple", volume: "58.4M", price: "$178.72", change: "+2.34%" },
  { symbol: "AMD", name: "AMD", volume: "52.8M", price: "$178.50", change: "+5.67%" },
  { symbol: "META", name: "Meta", volume: "48.2M", price: "$505.95", change: "+3.24%" },
];

const upcomingEarnings = [
  { symbol: "NVDA", name: "NVIDIA", date: "Feb 21", time: "After Close" },
  { symbol: "WMT", name: "Walmart", date: "Feb 20", time: "Before Open" },
  { symbol: "HD", name: "Home Depot", date: "Feb 20", time: "Before Open" },
  { symbol: "BKNG", name: "Booking Holdings", date: "Feb 22", time: "After Close" },
];

export default function MarketPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
        <p className="text-muted-foreground">
          Real-time market data and sector performance.
        </p>
      </div>

      <Tabs defaultValue="sectors" className="w-full">
        <TabsList>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="active">Most Active</TabsTrigger>
          <TabsTrigger value="earnings">Earnings Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="sectors" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector) => (
              <Card key={sector.name} className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{sector.name}</h3>
                      <p className="text-sm text-muted-foreground">{sector.stocks} stocks</p>
                    </div>
                    <div className="text-right">
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

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
                {mostActive.map((stock, index) => (
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
                        <p className="font-medium">{stock.volume}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">{stock.price}</span>
                        <p
                          className={`text-sm font-medium ${
                            stock.change.startsWith("+") ? "text-success" : "text-destructive"
                          }`}
                        >
                          {stock.change}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-4">
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
