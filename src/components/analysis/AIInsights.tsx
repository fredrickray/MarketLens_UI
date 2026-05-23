"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles, AlertTriangle } from "lucide-react";
import type { AnalysisRecommendation } from "@/lib/api/types";

interface AIInsightsProps {
  recommendation: AnalysisRecommendation;
  featuresUsed?: string[];
  modelVersion?: string;
  mode?: string;
}

const FEATURE_LABELS: Record<string, string> = {
  return_1d: "1-day return",
  return_5d: "5-day return",
  return_10d: "10-day return",
  return_20d: "20-day return",
  volatility_20d: "20-day volatility",
  volume_ratio_5d: "Volume vs 5-day avg",
  price_vs_sma_20: "Price vs 20-day average",
  rsi_14: "RSI (14)",
  sma_5_vs_sma_20: "Short vs medium trend",
  vol_ratio_5_20: "Volatility regime",
  volume_trend_5_20: "Volume trend",
};

const AIInsights = ({
  recommendation,
  featuresUsed,
  modelVersion,
  mode,
}: AIInsightsProps) => {
  const confidencePct = Math.round(recommendation.confidence * 100);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3">
          <span className="text-sm font-medium">Model confidence</span>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-primary">{confidencePct}%</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {recommendation.explanation}
        </p>

        {featuresUsed && featuresUsed.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold">Key drivers</h4>
            <div className="space-y-2">
              {featuresUsed.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2"
                >
                  <span className="text-sm">{FEATURE_LABELS[feature] ?? feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendation.warnings.length > 0 && (
          <div className="space-y-2">
            {recommendation.warnings.map((warning) => (
              <div
                key={warning}
                className="flex items-start gap-2 rounded-lg border border-warning/20 bg-warning/5 p-3 text-sm text-warning"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{warning}</span>
              </div>
            ))}
          </div>
        )}

        {(modelVersion || mode) && (
          <p className="text-xs text-muted-foreground">
            Model {modelVersion ?? "—"}
            {mode ? ` · ${mode}` : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;
