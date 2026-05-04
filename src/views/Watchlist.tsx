"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, TrendingUp, TrendingDown, Trash2, Plus, Search, Filter, Bell } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock watchlist data
const initialWatchlist = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 3.21, changePercent: 1.72, recommendation: "buy" as const, hasAlert: true },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.28, change: 24.56, changePercent: 2.89, recommendation: "buy" as const, hasAlert: false },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 248.42, change: -5.18, changePercent: -2.04, recommendation: "hold" as const, hasAlert: true },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 420.55, change: 6.82, changePercent: 1.65, recommendation: "buy" as const, hasAlert: false },
];

const availableStocks = [
  { symbol: "META", name: "Meta Platforms, Inc.", price: 505.15, change: 12.34, changePercent: 2.50 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -1.25, changePercent: -0.87 },
  { symbol: "AMZN", name: "Amazon.com, Inc.", price: 178.25, change: 2.45, changePercent: 1.39 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 156.78, change: -3.21, changePercent: -2.01 },
];

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState("");

  const filteredWatchlist = watchlist
    .filter(stock => 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price": return b.price - a.price;
        case "change": return b.changePercent - a.changePercent;
        case "name": return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(stock => stock.symbol !== symbol));
  };

  const handleAddToWatchlist = (stock: typeof availableStocks[0]) => {
    if (!watchlist.find(s => s.symbol === stock.symbol)) {
      setWatchlist([...watchlist, { ...stock, recommendation: "hold" as const, hasAlert: false }]);
    }
    setAddDialogOpen(false);
    setAddSearchQuery("");
  };

  const filteredAvailableStocks = availableStocks.filter(
    stock => 
      !watchlist.find(s => s.symbol === stock.symbol) &&
      (stock.symbol.toLowerCase().includes(addSearchQuery.toLowerCase()) ||
       stock.name.toLowerCase().includes(addSearchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
          <p className="text-muted-foreground">Track your favorite stocks and get AI-powered insights</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="change">% Change</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Watchlist</DialogTitle>
                <DialogDescription>
                  Search and add stocks to your watchlist
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stocks..."
                    value={addSearchQuery}
                    onChange={(e) => setAddSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredAvailableStocks.map(stock => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleAddToWatchlist(stock)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                    >
                      <div>
                        <p className="font-semibold">{stock.symbol}</p>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">${stock.price.toFixed(2)}</p>
                        <p className={`text-sm ${stock.change >= 0 ? "text-success" : "text-destructive"}`}>
                          {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </button>
                  ))}
                  {filteredAvailableStocks.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No stocks found
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Watchlist Grid */}
        {filteredWatchlist.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredWatchlist.map(stock => {
              const isPositive = stock.change >= 0;
              return (
                <Card key={stock.symbol} className="group relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Link 
                            href={`/stock/${stock.symbol}`}
                            className="hover:text-primary transition-colors"
                          >
                            {stock.symbol}
                          </Link>
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          {stock.hasAlert && (
                            <Bell className="h-4 w-4 text-primary" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                      <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                        stock.recommendation === "buy" ? "bg-success/10 text-success border-success/20" :
                        stock.recommendation === "hold" ? "bg-warning/10 text-warning border-warning/20" :
                        "bg-destructive/10 text-destructive border-destructive/20"
                      }`}>
                        {stock.recommendation}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold font-mono">${stock.price.toFixed(2)}</p>
                        <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-success" : "text-destructive"}`}>
                          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span>
                            {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <Link href={`/alerts?symbol=${stock.symbol}`}>
                            <Bell className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Star className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Start adding stocks to track their performance and receive AI-powered insights
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Stock
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Watchlist;
