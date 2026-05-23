"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { StockOverview as StockOverviewType } from "@/lib/api/types";

interface StockOverviewProps {
  overview: StockOverviewType;
}

function formatLarge(value?: number): string {
  if (value === undefined || value === null) return "—";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function formatVolume(value?: number): string {
  if (value === undefined || value === null) return "—";
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return `${value}`;
}

const StockOverview = ({ overview }: StockOverviewProps) => {
  const { quote } = overview;
  const metrics = [
    { label: "Market Cap", value: formatLarge(overview.marketCap) },
    { label: "Volume", value: formatVolume(quote.volume) },
    {
      label: "Day High",
      value: quote.high !== undefined ? `$${quote.high.toFixed(2)}` : "—",
    },
    {
      label: "Day Low",
      value: quote.low !== undefined ? `$${quote.low.toFixed(2)}` : "—",
    },
    {
      label: "52W High",
      value:
        overview.fiftyTwoWeekHigh !== undefined
          ? `$${overview.fiftyTwoWeekHigh.toFixed(2)}`
          : "—",
    },
    {
      label: "52W Low",
      value:
        overview.fiftyTwoWeekLow !== undefined
          ? `$${overview.fiftyTwoWeekLow.toFixed(2)}`
          : "—",
    },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-lg font-semibold font-mono">{metric.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockOverview;
