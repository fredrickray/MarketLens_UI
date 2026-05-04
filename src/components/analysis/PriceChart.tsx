"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

interface PriceChartProps {
  symbol: string;
  isPositive: boolean;
}

// Generate mock price data
const generatePriceData = (days: number, basePrice: number, volatility: number) => {
  const data: { date: string; price: number; volume: number }[] = [];
  let price = basePrice * 0.9;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    price = price + (Math.random() - 0.48) * volatility;
    price = Math.max(price, basePrice * 0.7);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      price: Number(price.toFixed(2)),
      volume: Math.floor(Math.random() * 50 + 20) * 1000000,
    });
  }
  return data;
};

const timeframes = [
  { label: "1D", days: 1 },
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "1Y", days: 365 },
];

const PriceChart = ({ symbol, isPositive }: PriceChartProps) => {
  const [timeframe, setTimeframe] = useState("1M");
  
  const selectedTimeframe = timeframes.find((t) => t.label === timeframe) || timeframes[2];
  const basePrice = symbol === "NVDA" ? 875 : symbol === "MSFT" ? 420 : symbol === "META" ? 505 : symbol === "AAPL" ? 189 : symbol === "TSLA" ? 248 : 141;
  const data = generatePriceData(selectedTimeframe.days, basePrice, basePrice * 0.02);
  
  const chartColor = isPositive ? "hsl(142, 71%, 45%)" : "hsl(0, 72%, 51%)";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Price History
          </CardTitle>
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList className="h-8">
              {timeframes.map((tf) => (
                <TabsTrigger key={tf.label} value={tf.label} className="text-xs px-3">
                  {tf.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickMargin={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `$${value}`}
                domain={["dataMin - 5", "dataMax + 5"]}
                width={60}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
