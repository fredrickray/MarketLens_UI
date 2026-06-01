"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { useStockHistory } from "@/hooks/api";
import { ApiError } from "@/lib/api/client";

interface PriceChartProps {
  symbol: string;
  currency?: string;
  days?: number;
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function formatAxisDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const PriceChart = ({ symbol, currency = "USD", days = 90 }: PriceChartProps) => {
  const historyQuery = useStockHistory(symbol, days);
  const historyUnavailable =
    historyQuery.isError &&
    historyQuery.error instanceof ApiError &&
    historyQuery.error.status === 404;

  if (historyQuery.isLoading) {
    return <Skeleton className="h-72 w-full" />;
  }

  if (historyUnavailable || !historyQuery.data?.prices.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Price history</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Price history is not available for this listing with our current data
            providers.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { prices, timestamps } = historyQuery.data;
  const data = timestamps.map((ts, i) => ({
    date: formatAxisDate(ts),
    price: prices[i],
  }));

  const currencySymbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : `${currency} `;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Price history
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            Last {prices.length} sessions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <LineChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={32}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(v: number) => `${currencySymbol}${v.toFixed(0)}`}
              domain={["auto", "auto"]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-mono">
                      {currencySymbol}
                      {Number(value).toFixed(2)}
                    </span>
                  )}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
