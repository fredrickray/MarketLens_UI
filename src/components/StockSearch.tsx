"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStockSearch } from "@/hooks/api";

const StockSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const { data: results, isFetching } = useStockSearch(debounced, debounced.length > 0);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (symbol: string) => {
    if (!symbol.trim()) return;
    setOpen(false);
    router.push(`/stock/${encodeURIComponent(symbol.trim().toUpperCase())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const first = results?.[0]?.symbol;
    go(first ?? query);
  };

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search any stock (e.g., AAPL, TSLA, GOOGL)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            className="h-14 rounded-xl border-border bg-card pl-12 pr-32 text-base shadow-sm transition-shadow focus:shadow-md"
          />
          <Button type="submit" size="sm" className="absolute right-2 h-10 px-5">
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
          </Button>
        </div>
      </form>

      {open && debounced.length > 0 && results && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {results.slice(0, 8).map((result) => (
            <button
              key={result.symbol}
              type="button"
              onClick={() => go(result.symbol)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-secondary/50"
            >
              <span className="font-semibold">{result.symbol}</span>
              <span className="ml-3 truncate text-sm text-muted-foreground">
                {result.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
