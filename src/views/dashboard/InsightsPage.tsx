"use client";

import { Brain, TrendingUp, TrendingDown, Minus, Filter, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";

const allInsights = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    recommendation: "Strong Buy",
    confidence: 92,
    summary: "AI chip demand surge, strong earnings momentum, and dominant market position in data center GPUs.",
    type: "bullish" as const,
    factors: ["Strong Q4 earnings", "AI demand surge", "Data center growth"],
    lastUpdated: "2 hours ago",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    recommendation: "Hold",
    confidence: 68,
    summary: "Mixed signals with Vision Pro launch offset by iPhone sales concerns in China and regulatory headwinds.",
    type: "neutral" as const,
    factors: ["Vision Pro launch", "China sales decline", "Services growth"],
    lastUpdated: "3 hours ago",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    recommendation: "Sell",
    confidence: 75,
    summary: "Price cuts impacting margins, increased competition in EV market, and production challenges.",
    type: "bearish" as const,
    factors: ["Margin compression", "EV competition", "Demand concerns"],
    lastUpdated: "1 hour ago",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    recommendation: "Buy",
    confidence: 85,
    summary: "Azure cloud growth acceleration, Copilot AI integration across products, and strong enterprise demand.",
    type: "bullish" as const,
    factors: ["Azure growth", "AI integration", "Enterprise demand"],
    lastUpdated: "4 hours ago",
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    recommendation: "Buy",
    confidence: 78,
    summary: "Advertising revenue recovery, cost efficiency measures, and Reality Labs investments showing progress.",
    type: "bullish" as const,
    factors: ["Ad revenue growth", "Cost cuts", "AI investments"],
    lastUpdated: "5 hours ago",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    recommendation: "Hold",
    confidence: 65,
    summary: "Search advertising remains strong but AI competition from ChatGPT and regulatory scrutiny create uncertainty.",
    type: "neutral" as const,
    factors: ["Search dominance", "AI competition", "Regulatory risk"],
    lastUpdated: "6 hours ago",
  },
];

const typeStyles = {
  bullish: {
    badge: "bg-success/10 text-success border-success/20",
    icon: TrendingUp,
    label: "Bullish",
  },
  neutral: {
    badge: "bg-warning/10 text-warning border-warning/20",
    icon: Minus,
    label: "Neutral",
  },
  bearish: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    icon: TrendingDown,
    label: "Bearish",
  },
};

export default function InsightsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredInsights = allInsights.filter((insight) =>
    filter === "all" ? true : insight.type === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Insights
          </h1>
          <p className="text-muted-foreground">
            AI-powered stock analysis and recommendations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Insights</SelectItem>
              <SelectItem value="bullish">Bullish Only</SelectItem>
              <SelectItem value="neutral">Neutral Only</SelectItem>
              <SelectItem value="bearish">Bearish Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredInsights.map((insight) => {
          const style = typeStyles[insight.type];
          const Icon = style.icon;

          return (
            <Card key={insight.symbol} className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Link
                        href={`/stock/${insight.symbol}`}
                        className="text-2xl font-bold hover:text-primary transition-colors"
                      >
                        {insight.symbol}
                      </Link>
                      <Badge variant="outline" className={style.badge}>
                        <Icon className="h-3 w-3 mr-1" />
                        {insight.recommendation}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Updated {insight.lastUpdated}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{insight.name}</p>
                    <p className="mb-4">{insight.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {insight.factors.map((factor) => (
                        <Badge key={factor} variant="secondary">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg min-w-[120px]">
                    <span className="text-sm text-muted-foreground mb-1">Confidence</span>
                    <span className="text-3xl font-bold text-primary">{insight.confidence}%</span>
                    <div className="w-full bg-muted-foreground/20 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
