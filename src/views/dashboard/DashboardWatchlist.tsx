"use client";

import { useState } from "react";
import { Star, Trash2, TrendingUp, TrendingDown, Plus, Search, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { toast } from "sonner";

interface WatchlistStock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  alertSet: boolean;
}

const initialWatchlist: WatchlistStock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: "$178.72", change: "+2.34%", isPositive: true, alertSet: true },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: "$878.35", change: "+4.12%", isPositive: true, alertSet: false },
  { symbol: "TSLA", name: "Tesla Inc.", price: "$175.21", change: "-1.87%", isPositive: false, alertSet: true },
  { symbol: "MSFT", name: "Microsoft", price: "$425.22", change: "+1.15%", isPositive: true, alertSet: false },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: "$156.37", change: "+0.89%", isPositive: true, alertSet: false },
];

const availableStocks = [
  { symbol: "META", name: "Meta Platforms", price: "$505.95", change: "+3.24%", isPositive: true },
  { symbol: "AMZN", name: "Amazon.com", price: "$178.25", change: "+1.45%", isPositive: true },
  { symbol: "AMD", name: "AMD Inc.", price: "$178.50", change: "+5.67%", isPositive: true },
  { symbol: "NFLX", name: "Netflix Inc.", price: "$605.88", change: "+2.15%", isPositive: true },
  { symbol: "DIS", name: "Walt Disney", price: "$112.45", change: "-0.85%", isPositive: false },
];

export default function DashboardWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>(initialWatchlist);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemove = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s.symbol !== symbol));
    toast.success(`${symbol} removed from watchlist`);
  };

  const handleAdd = (stock: typeof availableStocks[0]) => {
    if (!watchlist.find((s) => s.symbol === stock.symbol)) {
      setWatchlist([...watchlist, { ...stock, alertSet: false }]);
      toast.success(`${stock.symbol} added to watchlist`);
    }
    setIsDialogOpen(false);
  };

  const toggleAlert = (symbol: string) => {
    setWatchlist(
      watchlist.map((s) =>
        s.symbol === symbol ? { ...s, alertSet: !s.alertSet } : s
      )
    );
    const stock = watchlist.find((s) => s.symbol === symbol);
    if (stock) {
      toast.success(
        stock.alertSet
          ? `Alert removed for ${symbol}`
          : `Alert set for ${symbol}`
      );
    }
  };

  const filteredWatchlist = watchlist.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Star className="h-8 w-8 text-warning" />
            My Watchlist
          </h1>
          <p className="text-muted-foreground">
            Track your favorite stocks and set alerts.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Watchlist</DialogTitle>
              <DialogDescription>
                Select a stock to add to your watchlist.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {availableStocks
                .filter((s) => !watchlist.find((w) => w.symbol === s.symbol))
                .map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleAdd(stock)}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold">{stock.symbol}</span>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{stock.price}</span>
                      <p
                        className={`text-sm ${
                          stock.isPositive ? "text-success" : "text-destructive"
                        }`}
                      >
                        {stock.change}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search watchlist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{filteredWatchlist.length} Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWatchlist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stocks in your watchlist. Add some to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWatchlist.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Link
                    href={`/stock/${stock.symbol}`}
                    className="flex items-center gap-4 flex-1"
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {stock.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{stock.symbol}</span>
                        {stock.alertSet && (
                          <Badge variant="outline" className="text-xs">
                            <Bell className="h-3 w-3 mr-1" />
                            Alert
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4">
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
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleAlert(stock.symbol)}
                        className={stock.alertSet ? "text-primary" : "text-muted-foreground"}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(stock.symbol)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
