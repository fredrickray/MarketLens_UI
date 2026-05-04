"use client";

import { Brain, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const aiInsights = [
  {
    symbol: "NVDA",
    recommendation: "Strong Buy",
    confidence: 92,
    summary: "AI chip demand surge, strong earnings momentum, and dominant market position.",
    type: "bullish" as const,
  },
  {
    symbol: "AAPL",
    recommendation: "Hold",
    confidence: 68,
    summary: "Mixed signals with Vision Pro launch offset by iPhone sales concerns in China.",
    type: "neutral" as const,
  },
  {
    symbol: "TSLA",
    recommendation: "Sell",
    confidence: 75,
    summary: "Price cuts impacting margins, increased competition in EV market.",
    type: "bearish" as const,
  },
];

const typeStyles = {
  bullish: {
    badge: "bg-success/10 text-success border-success/20",
    icon: TrendingUp,
  },
  neutral: {
    badge: "bg-warning/10 text-warning border-warning/20",
    icon: Minus,
  },
  bearish: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    icon: TrendingDown,
  },
};

export function AIInsightsWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/insights">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiInsights.map((insight) => {
            const style = typeStyles[insight.type];
            const Icon = style.icon;

            return (
              <Link
                key={insight.symbol}
                href={`/stock/${insight.symbol}`}
                className="block p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{insight.symbol}</span>
                    <Badge variant="outline" className={style.badge}>
                      <Icon className="h-3 w-3 mr-1" />
                      {insight.recommendation}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <p className="font-bold text-primary">{insight.confidence}%</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{insight.summary}</p>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
