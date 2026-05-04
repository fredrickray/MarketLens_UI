"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StockOverviewProps {
  stock: {
    marketCap: string;
    volume: string;
    peRatio: number;
    high52w: number;
    low52w: number;
    avgVolume: string;
  };
}

const StockOverview = ({ stock }: StockOverviewProps) => {
  const metrics = [
    { label: "Market Cap", value: stock.marketCap },
    { label: "Volume", value: stock.volume },
    { label: "Avg Volume", value: stock.avgVolume },
    { label: "P/E Ratio", value: stock.peRatio.toFixed(2) },
    { label: "52W High", value: `$${stock.high52w.toFixed(2)}` },
    { label: "52W Low", value: `$${stock.low52w.toFixed(2)}` },
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
