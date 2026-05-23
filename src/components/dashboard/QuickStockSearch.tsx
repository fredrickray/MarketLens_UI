"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useStockSearch } from "@/hooks/api";

const POPULAR = ["AAPL", "NVDA", "TSLA", "MSFT", "META", "GOOGL", "AMZN", "AMD"];

export function QuickStockSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: results, isFetching } = useStockSearch(debounced, debounced.length > 0);
  const showResults = debounced.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = results?.[0]?.symbol ?? searchQuery.trim().toUpperCase();
    if (symbol) router.push(`/stock/${encodeURIComponent(symbol)}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Quick Stock Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {isFetching && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </form>

        {showResults ? (
          <div className="space-y-2">
            {(results ?? []).slice(0, 8).map((stock) => (
              <Link
                key={stock.symbol}
                href={`/stock/${stock.symbol}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <span className="font-bold">{stock.symbol}</span>
                <span className="ml-3 truncate text-sm text-muted-foreground">{stock.name}</span>
              </Link>
            ))}
            {!isFetching && results && results.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No matches found</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {POPULAR.map((symbol) => (
              <Link
                key={symbol}
                href={`/stock/${symbol}`}
                className="p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors text-center font-bold"
              >
                {symbol}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
