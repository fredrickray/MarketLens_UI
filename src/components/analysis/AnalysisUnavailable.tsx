"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Info } from "lucide-react";

interface AnalysisUnavailableProps {
  symbol?: string;
  message?: string;
  historyUnavailable?: boolean;
}

const DEFAULT_HISTORY_MESSAGE =
  "AI analysis is not available for this exchange. Price history is required, and our free market-data providers do not cover historical prices for this listing yet. Quotes and news may still be available.";

const DEFAULT_GENERIC_MESSAGE =
  "AI analysis could not be generated for this stock right now. Quotes and news may still be available.";

const AnalysisUnavailable = ({
  symbol,
  message,
  historyUnavailable = false,
}: AnalysisUnavailableProps) => {
  const body =
    message ??
    (historyUnavailable ? DEFAULT_HISTORY_MESSAGE : DEFAULT_GENERIC_MESSAGE);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-muted-foreground" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
            {historyUnavailable
              ? "Analysis not available for this exchange"
              : "Analysis unavailable"}
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {body}
          </p>
          {symbol && historyUnavailable && (
            <p className="mt-3 text-xs text-muted-foreground">
              Symbol: {symbol}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisUnavailable;
