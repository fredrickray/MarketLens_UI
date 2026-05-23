"use client";

import StockCard from "./StockCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useStockOverview } from "@/hooks/api";

const TRENDING_SYMBOLS = ["AAPL", "NVDA", "TSLA", "MSFT", "META", "GOOGL"];

function TrendingCard({ symbol }: { symbol: string }) {
  const { data: overview, isLoading } = useStockOverview(symbol);
  const quote = overview?.quote;

  if (isLoading || !quote) {
    return <Skeleton className="h-[140px] w-full rounded-xl" />;
  }

  return (
    <StockCard
      symbol={symbol}
      name={overview?.name ?? symbol}
      price={quote.price}
      change={quote.change}
      changePercent={quote.changePercent}
    />
  );
}

const TrendingSection = () => {
  return (
    <section id="trending" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Trending Stocks</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Live quotes for the market&apos;s most-watched names. Open any stock for a full
            AI-powered analysis.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRENDING_SYMBOLS.map((symbol) => (
            <TrendingCard key={symbol} symbol={symbol} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
