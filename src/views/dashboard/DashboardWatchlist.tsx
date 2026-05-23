"use client";

import { useEffect, useState } from "react";
import { Star, Trash2, TrendingUp, TrendingDown, Plus, Search, Bell, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useStockOverview,
  useStockSearch,
} from "@/hooks/api";
import { ApiError } from "@/lib/api/client";

function WatchlistRow({
  symbol,
  onRemove,
  removing,
}: {
  symbol: string;
  onRemove: (s: string) => void;
  removing: boolean;
}) {
  const { data: overview, isLoading } = useStockOverview(symbol);
  const quote = overview?.quote;
  const isPositive = (quote?.change ?? 0) >= 0;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <Link href={`/stock/${symbol}`} className="flex items-center gap-4 flex-1">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="font-bold text-primary">{symbol.slice(0, 2)}</span>
        </div>
        <div>
          <span className="font-semibold text-lg">{symbol}</span>
          <p className="text-sm text-muted-foreground">{overview?.name ?? symbol}</p>
        </div>
      </Link>
      <div className="flex items-center gap-4">
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
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? "+" : ""}
                {quote.changePercent.toFixed(2)}%
              </p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" asChild className="text-muted-foreground">
            <Link href={`/alerts?symbol=${symbol}`}>
              <Bell className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(symbol)}
            disabled={removing}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardWatchlist() {
  const { data: symbols, isLoading } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(addQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [addQuery]);

  const { data: results, isFetching } = useStockSearch(debounced, debounced.length > 0);

  const list = symbols ?? [];
  const filtered = list.filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
  const available = (results ?? []).filter((r) => !list.includes(r.symbol));

  const handleRemove = async (symbol: string) => {
    try {
      await removeFromWatchlist.mutateAsync(symbol);
      toast.success(`${symbol} removed from watchlist`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not remove");
    }
  };

  const handleAdd = async (symbol: string) => {
    try {
      await addToWatchlist.mutateAsync(symbol);
      toast.success(`${symbol} added to watchlist`);
      setIsDialogOpen(false);
      setAddQuery("");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not add");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Star className="h-8 w-8 text-warning" />
            My Watchlist
          </h1>
          <p className="text-muted-foreground">Track your favorite stocks and set alerts.</p>
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
              <DialogDescription>Search a stock to add to your watchlist.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search stocks..."
                  value={addQuery}
                  onChange={(e) => setAddQuery(e.target.value)}
                  className="pl-10"
                />
                {isFetching && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {available.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleAdd(stock.symbol)}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="font-semibold">{stock.symbol}</span>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                {debounced && !isFetching && available.length === 0 && (
                  <p className="text-center text-muted-foreground py-6">No stocks found</p>
                )}
              </div>
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
          <CardTitle>{filtered.length} Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stocks in your watchlist. Add some to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((symbol) => (
                <WatchlistRow
                  key={symbol}
                  symbol={symbol}
                  onRemove={handleRemove}
                  removing={removeFromWatchlist.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
