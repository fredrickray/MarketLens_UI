"use client";

import StockCard from "./StockCard";

const trendingStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 3.21, changePercent: 1.72, recommendation: "buy" as const },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.28, change: 24.56, changePercent: 2.89, recommendation: "buy" as const },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 248.42, change: -5.18, changePercent: -2.04, recommendation: "hold" as const },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 420.55, change: 6.82, changePercent: 1.65, recommendation: "buy" as const },
  { symbol: "META", name: "Meta Platforms, Inc.", price: 505.15, change: 12.34, changePercent: 2.50, recommendation: "buy" as const },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -1.25, changePercent: -0.87, recommendation: "hold" as const },
];

const TrendingSection = () => {
  return (
    <section id="trending" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Trending Stocks</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Real-time AI recommendations based on market analysis, news sentiment, and technical indicators.
          </p>
        </div>
        
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trendingStocks.map((stock) => (
            <StockCard key={stock.symbol} {...stock} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
