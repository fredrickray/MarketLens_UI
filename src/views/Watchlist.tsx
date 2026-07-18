"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Star, TrendingUp, TrendingDown, Trash2, Plus, Search, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
  useStockOverview,
  useStockSearch,
} from "@/hooks/api";
import { ApiError } from "@/lib/api/client";

const WatchlistCard = ({
  symbol,
  onRemove,
  removing,
}: {
  symbol: string;
  onRemove: (symbol: string) => void;
  removing: boolean;
}) => {
  const { data: overview, isLoading } = useStockOverview(symbol);
  const quote = overview?.quote;
  const isPositive = (quote?.change ?? 0) >= 0;

  return (
    <Card className="group relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Link href={`/stock/${symbol}`} className="hover:text-primary transition-colors">
                {symbol}
              </Link>
              <Star className="h-4 w-4 fill-warning text-warning" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">{overview?.name ?? symbol}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            {isLoading || !quote ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <p className="text-2xl font-bold font-mono">${quote.price.toFixed(2)}</p>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRemove(symbol)}
            disabled={removing}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Watchlist = () => {
  const { data: symbols, isLoading } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const { data: searchResults, isFetching } = useStockSearch(
    addSearchQuery.trim(),
    addSearchQuery.trim().length > 0,
  );

  const list = symbols ?? [];

  const handleRemove = async (symbol: string) => {
    try {
      await removeFromWatchlist.mutateAsync(symbol);
      toast.success(`Removed ${symbol}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not remove");
    }
  };

  const handleAdd = async (symbol: string) => {
    try {
      await addToWatchlist.mutateAsync(symbol);
      toast.success(`Added ${symbol}`);
      setAddDialogOpen(false);
      setAddSearchQuery("");
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Could not add");
    }
  };

  const available = (searchResults ?? []).filter((r) => !list.includes(r.symbol));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
            <p className="text-muted-foreground">
              Track your favorite stocks and get AI-powered insights
            </p>
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
                <DialogDescription>Search and add stocks to your watchlist</DialogDescription>
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
                  {isFetching && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {available.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => handleAdd(stock.symbol)}
                      disabled={addToWatchlist.isPending}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                    >
                      <div>
                        <p className="font-semibold">{stock.symbol}</p>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                  {addSearchQuery.trim() && !isFetching && available.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No stocks found</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : list.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((symbol) => (
              <WatchlistCard
                key={symbol}
                symbol={symbol}
                onRemove={handleRemove}
                removing={removeFromWatchlist.isPending}
              />
            ))}
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
