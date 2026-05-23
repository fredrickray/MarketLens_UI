"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Star,
  Loader2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AIInsights from "@/components/analysis/AIInsights";
import NewsSentiment from "@/components/analysis/NewsSentiment";
import StockOverview from "@/components/analysis/StockOverview";
import {
  useStockAnalysis,
  useStockOverview,
  useWatchlist,
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from "@/hooks/api";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";

const badgeClass: Record<string, string> = {
  buy: "bg-success/10 text-success border-success/20",
  hold: "bg-warning/10 text-warning border-warning/20",
  avoid: "bg-destructive/10 text-destructive border-destructive/20",
};

/**
 * Logged-in users get the dashboard sidebar shell; guests keep the marketing
 * header/footer so the page doesn't look identical to the signed-out experience.
 */
const StockChrome = ({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: React.ReactNode;
}) => {
  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-6xl">{children}</div>
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
};

const StockAnalysis = () => {
  const params = useParams<{ symbol: string }>();
  const symbol = params?.symbol ? params.symbol.toUpperCase() : undefined;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const overviewQuery = useStockOverview(symbol);
  const analysisQuery = useStockAnalysis(symbol);
  const { data: watchlist } = useWatchlist();
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  const isWatched = !!symbol && (watchlist ?? []).includes(symbol);

  const handleWatchlistToggle = async () => {
    if (!symbol) return;
    try {
      if (isWatched) {
        await removeFromWatchlist.mutateAsync(symbol);
        toast.success(`Removed ${symbol} from watchlist`);
      } else {
        await addToWatchlist.mutateAsync(symbol);
        toast.success(`Added ${symbol} to watchlist`);
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not update watchlist",
      );
    }
  };

  const notFound =
    overviewQuery.isError &&
    overviewQuery.error instanceof ApiError &&
    overviewQuery.error.status === 404;

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound) {
    return (
      <StockChrome isAuthenticated={isAuthenticated}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">Stock Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            We couldn&apos;t find data for &quot;{symbol}&quot;
          </p>
          <Button asChild>
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
            </Link>
          </Button>
        </div>
      </StockChrome>
    );
  }

  const overview = overviewQuery.data;
  const analysis = analysisQuery.data;
  const quote = overview?.quote;
  const isPositive = (quote?.change ?? 0) >= 0;

  return (
    <StockChrome isAuthenticated={isAuthenticated}>
      <Link
        href={isAuthenticated ? "/dashboard" : "/"}
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
      </Link>

        {/* Stock Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{symbol}</h1>
                {analysis && (
                  <span
                    className={`rounded-full border px-3 py-1 text-sm font-medium capitalize ${
                      badgeClass[analysis.recommendation.action] ?? badgeClass.hold
                    }`}
                  >
                    {analysis.recommendation.action}
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWatchlistToggle}
                  disabled={addToWatchlist.isPending || removeFromWatchlist.isPending}
                >
                  <Star
                    className={`mr-1.5 h-4 w-4 ${isWatched ? "fill-warning text-warning" : ""}`}
                  />
                  {isWatched ? "Watching" : "Watch"}
                </Button>
              </div>
              {overviewQuery.isLoading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <p className="text-lg text-muted-foreground">{overview?.name ?? symbol}</p>
              )}
            </div>
            <div className="text-right">
              {overviewQuery.isLoading || !quote ? (
                <Skeleton className="h-12 w-40" />
              ) : (
                <>
                  <p className="text-4xl font-bold font-mono">${quote.price.toFixed(2)}</p>
                  <div
                    className={`flex items-center justify-end gap-2 text-lg ${
                      isPositive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    <span className="font-semibold">
                      {isPositive ? "+" : ""}
                      {quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Overview metrics */}
        {overview ? (
          <StockOverview overview={overview} />
        ) : (
          <Skeleton className="mb-6 h-24 w-full" />
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            {analysisQuery.isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : analysis ? (
              <AIInsights
                recommendation={analysis.recommendation}
                featuresUsed={analysis.model.features_used}
                modelVersion={analysis.model.version}
                mode={analysis.model.mode}
              />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysis unavailable
              </div>
            )}
          </div>

          {symbol && (
            <div>
              <NewsSentiment symbol={symbol} />
            </div>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          MarketLens provides informational analysis only and does not constitute
          financial advice. Past performance does not guarantee future results.
        </p>
    </StockChrome>
  );
};

export default StockAnalysis;
