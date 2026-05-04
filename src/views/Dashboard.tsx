"use client";

import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { WatchlistWidget } from "@/components/dashboard/WatchlistWidget";
import { AIInsightsWidget } from "@/components/dashboard/AIInsightsWidget";
import { QuickStockSearch } from "@/components/dashboard/QuickStockSearch";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your market overview and insights.
        </p>
      </div>

      <MarketOverview />

      <QuickStockSearch />

      <div className="grid lg:grid-cols-2 gap-6">
        <WatchlistWidget />
        <AIInsightsWidget />
      </div>
    </div>
  );
}
