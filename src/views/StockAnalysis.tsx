"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, BarChart3, Brain, Newspaper, Activity } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import PriceChart from "@/components/analysis/PriceChart";
import AIInsights from "@/components/analysis/AIInsights";
import NewsSentiment from "@/components/analysis/NewsSentiment";
import TechnicalIndicators from "@/components/analysis/TechnicalIndicators";
import StockOverview from "@/components/analysis/StockOverview";

// Mock stock data - will be replaced with real API data
const stocksData: Record<string, {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: "buy" | "hold" | "sell";
  marketCap: string;
  volume: string;
  peRatio: number;
  high52w: number;
  low52w: number;
  avgVolume: string;
}> = {
  AAPL: { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 3.21, changePercent: 1.72, recommendation: "buy", marketCap: "$2.95T", volume: "54.2M", peRatio: 31.2, high52w: 199.62, low52w: 164.08, avgVolume: "58.7M" },
  NVDA: { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.28, change: 24.56, changePercent: 2.89, recommendation: "buy", marketCap: "$2.16T", volume: "42.8M", peRatio: 68.5, high52w: 974.00, low52w: 403.11, avgVolume: "46.2M" },
  TSLA: { symbol: "TSLA", name: "Tesla, Inc.", price: 248.42, change: -5.18, changePercent: -2.04, recommendation: "hold", marketCap: "$790.5B", volume: "98.4M", peRatio: 54.3, high52w: 299.29, low52w: 152.37, avgVolume: "112.5M" },
  MSFT: { symbol: "MSFT", name: "Microsoft Corporation", price: 420.55, change: 6.82, changePercent: 1.65, recommendation: "buy", marketCap: "$3.12T", volume: "22.1M", peRatio: 36.8, high52w: 430.82, low52w: 309.45, avgVolume: "25.4M" },
  META: { symbol: "META", name: "Meta Platforms, Inc.", price: 505.15, change: 12.34, changePercent: 2.50, recommendation: "buy", marketCap: "$1.28T", volume: "18.6M", peRatio: 28.4, high52w: 542.81, low52w: 274.38, avgVolume: "16.8M" },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -1.25, changePercent: -0.87, recommendation: "hold", marketCap: "$1.75T", volume: "25.3M", peRatio: 24.6, high52w: 155.20, low52w: 120.21, avgVolume: "28.1M" },
};

const StockAnalysis = () => {
  const params = useParams<{ symbol: string }>();
  const symbol = params?.symbol;
  const stock = symbol ? stocksData[symbol.toUpperCase()] : null;

  if (!stock) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
            <h1 className="mb-2 text-2xl font-bold">Stock Not Found</h1>
            <p className="mb-6 text-muted-foreground">We couldn't find data for "{symbol}"</p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link 
          href="/" 
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Stock Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{stock.symbol}</h1>
                <span className={`rounded-full border px-3 py-1 text-sm font-medium capitalize ${
                  stock.recommendation === "buy" ? "bg-success/10 text-success border-success/20" :
                  stock.recommendation === "hold" ? "bg-warning/10 text-warning border-warning/20" :
                  "bg-destructive/10 text-destructive border-destructive/20"
                }`}>
                  {stock.recommendation}
                </span>
              </div>
              <p className="text-lg text-muted-foreground">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold font-mono">${stock.price.toFixed(2)}</p>
              <div className={`flex items-center justify-end gap-2 text-lg ${isPositive ? "text-success" : "text-destructive"}`}>
                {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                <span className="font-semibold">
                  {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Overview */}
        <StockOverview stock={stock} />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Price Chart - takes 2 columns */}
          <div className="lg:col-span-2">
            <PriceChart symbol={stock.symbol} isPositive={isPositive} />
          </div>

          {/* AI Insights */}
          <div>
            <AIInsights stock={stock} />
          </div>

          {/* Technical Indicators */}
          <div className="lg:col-span-2">
            <TechnicalIndicators symbol={stock.symbol} />
          </div>

          {/* News Sentiment */}
          <div>
            <NewsSentiment symbol={stock.symbol} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StockAnalysis;
