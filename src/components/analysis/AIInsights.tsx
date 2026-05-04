"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

interface AIInsightsProps {
  stock: {
    symbol: string;
    recommendation: "buy" | "hold" | "sell";
  };
}

const insightsData: Record<string, {
  summary: string;
  confidence: number;
  factors: { label: string; sentiment: "positive" | "neutral" | "negative" }[];
  prediction: string;
}> = {
  AAPL: {
    summary: "Strong buy signal driven by iPhone 16 momentum and services growth. AI integration in upcoming products positions Apple well for future growth.",
    confidence: 87,
    factors: [
      { label: "Revenue Growth", sentiment: "positive" },
      { label: "Services Expansion", sentiment: "positive" },
      { label: "China Market Concerns", sentiment: "negative" },
      { label: "AI Product Integration", sentiment: "positive" },
    ],
    prediction: "Target price $210 within 3 months",
  },
  NVDA: {
    summary: "Exceptional momentum from AI chip demand. Data center revenue continues to exceed expectations. Market leader position strengthens.",
    confidence: 92,
    factors: [
      { label: "AI Chip Demand", sentiment: "positive" },
      { label: "Data Center Growth", sentiment: "positive" },
      { label: "Competition Increasing", sentiment: "neutral" },
      { label: "Supply Chain Stable", sentiment: "positive" },
    ],
    prediction: "Target price $950 within 3 months",
  },
  TSLA: {
    summary: "Mixed signals with production efficiency gains offset by margin pressure and increasing EV competition. Robotaxi timeline uncertainty adds risk.",
    confidence: 58,
    factors: [
      { label: "Production Efficiency", sentiment: "positive" },
      { label: "Price Competition", sentiment: "negative" },
      { label: "FSD Development", sentiment: "neutral" },
      { label: "Energy Business", sentiment: "positive" },
    ],
    prediction: "Sideways movement expected, range $230-$270",
  },
  MSFT: {
    summary: "Azure cloud growth and Copilot AI integration driving strong enterprise adoption. Gaming division showing improved margins.",
    confidence: 85,
    factors: [
      { label: "Azure Growth", sentiment: "positive" },
      { label: "AI Copilot Adoption", sentiment: "positive" },
      { label: "Gaming Revenue", sentiment: "neutral" },
      { label: "Enterprise Spending", sentiment: "positive" },
    ],
    prediction: "Target price $450 within 3 months",
  },
  META: {
    summary: "Strong advertising recovery and Reels monetization. Reality Labs losses narrowing. AI investments showing early returns.",
    confidence: 81,
    factors: [
      { label: "Ad Revenue Recovery", sentiment: "positive" },
      { label: "Reels Growth", sentiment: "positive" },
      { label: "Reality Labs Costs", sentiment: "negative" },
      { label: "AI Features", sentiment: "positive" },
    ],
    prediction: "Target price $540 within 3 months",
  },
  GOOGL: {
    summary: "Search revenue stable but AI competition concerns persist. Cloud growth positive but below expectations. YouTube maintaining strength.",
    confidence: 62,
    factors: [
      { label: "Search Dominance", sentiment: "neutral" },
      { label: "AI Competition", sentiment: "negative" },
      { label: "Cloud Growth", sentiment: "positive" },
      { label: "YouTube Revenue", sentiment: "positive" },
    ],
    prediction: "Consolidation expected, range $135-$150",
  },
};

const AIInsights = ({ stock }: AIInsightsProps) => {
  const insights = insightsData[stock.symbol] || insightsData.AAPL;

  const getSentimentIcon = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-3.5 w-3.5 text-success" />;
      case "negative":
        return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
      default:
        return <Minus className="h-3.5 w-3.5 text-warning" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Confidence Score */}
        <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
          <span className="text-sm font-medium">AI Confidence</span>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-primary">{insights.confidence}%</span>
          </div>
        </div>

        {/* Summary */}
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">{insights.summary}</p>
        </div>

        {/* Key Factors */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">Key Factors</h4>
          <div className="space-y-2">
            {insights.factors.map((factor) => (
              <div 
                key={factor.label} 
                className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2"
              >
                <span className="text-sm">{factor.label}</span>
                {getSentimentIcon(factor.sentiment)}
              </div>
            ))}
          </div>
        </div>

        {/* Prediction */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-sm font-medium text-primary">{insights.prediction}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
