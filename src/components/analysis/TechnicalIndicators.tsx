"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TechnicalIndicatorsProps {
  symbol: string;
}

const technicalData: Record<string, {
  rsi: number;
  macd: "bullish" | "bearish" | "neutral";
  movingAverages: { ma20: "above" | "below"; ma50: "above" | "below"; ma200: "above" | "below" };
  support: number;
  resistance: number;
  indicators: { name: string; value: string; signal: "buy" | "sell" | "neutral" }[];
}> = {
  AAPL: {
    rsi: 62,
    macd: "bullish",
    movingAverages: { ma20: "above", ma50: "above", ma200: "above" },
    support: 182.50,
    resistance: 195.00,
    indicators: [
      { name: "RSI (14)", value: "62.4", signal: "neutral" },
      { name: "MACD", value: "2.15", signal: "buy" },
      { name: "Stochastic", value: "78.2", signal: "neutral" },
      { name: "Williams %R", value: "-22.5", signal: "buy" },
      { name: "CCI (20)", value: "85.3", signal: "buy" },
      { name: "ADX (14)", value: "28.7", signal: "buy" },
    ],
  },
  NVDA: {
    rsi: 71,
    macd: "bullish",
    movingAverages: { ma20: "above", ma50: "above", ma200: "above" },
    support: 820.00,
    resistance: 950.00,
    indicators: [
      { name: "RSI (14)", value: "71.2", signal: "neutral" },
      { name: "MACD", value: "18.45", signal: "buy" },
      { name: "Stochastic", value: "82.5", signal: "neutral" },
      { name: "Williams %R", value: "-15.8", signal: "buy" },
      { name: "CCI (20)", value: "125.6", signal: "buy" },
      { name: "ADX (14)", value: "42.3", signal: "buy" },
    ],
  },
  TSLA: {
    rsi: 45,
    macd: "bearish",
    movingAverages: { ma20: "below", ma50: "below", ma200: "above" },
    support: 230.00,
    resistance: 265.00,
    indicators: [
      { name: "RSI (14)", value: "45.8", signal: "neutral" },
      { name: "MACD", value: "-3.22", signal: "sell" },
      { name: "Stochastic", value: "38.4", signal: "neutral" },
      { name: "Williams %R", value: "-58.2", signal: "neutral" },
      { name: "CCI (20)", value: "-42.1", signal: "sell" },
      { name: "ADX (14)", value: "22.5", signal: "neutral" },
    ],
  },
  MSFT: {
    rsi: 58,
    macd: "bullish",
    movingAverages: { ma20: "above", ma50: "above", ma200: "above" },
    support: 405.00,
    resistance: 435.00,
    indicators: [
      { name: "RSI (14)", value: "58.3", signal: "neutral" },
      { name: "MACD", value: "4.82", signal: "buy" },
      { name: "Stochastic", value: "65.7", signal: "neutral" },
      { name: "Williams %R", value: "-32.1", signal: "buy" },
      { name: "CCI (20)", value: "72.4", signal: "buy" },
      { name: "ADX (14)", value: "31.2", signal: "buy" },
    ],
  },
  META: {
    rsi: 65,
    macd: "bullish",
    movingAverages: { ma20: "above", ma50: "above", ma200: "above" },
    support: 485.00,
    resistance: 530.00,
    indicators: [
      { name: "RSI (14)", value: "65.1", signal: "neutral" },
      { name: "MACD", value: "8.34", signal: "buy" },
      { name: "Stochastic", value: "72.3", signal: "neutral" },
      { name: "Williams %R", value: "-25.6", signal: "buy" },
      { name: "CCI (20)", value: "95.2", signal: "buy" },
      { name: "ADX (14)", value: "35.8", signal: "buy" },
    ],
  },
  GOOGL: {
    rsi: 48,
    macd: "neutral",
    movingAverages: { ma20: "below", ma50: "above", ma200: "above" },
    support: 135.00,
    resistance: 148.00,
    indicators: [
      { name: "RSI (14)", value: "48.2", signal: "neutral" },
      { name: "MACD", value: "-0.85", signal: "neutral" },
      { name: "Stochastic", value: "42.8", signal: "neutral" },
      { name: "Williams %R", value: "-52.4", signal: "neutral" },
      { name: "CCI (20)", value: "-18.5", signal: "neutral" },
      { name: "ADX (14)", value: "18.9", signal: "neutral" },
    ],
  },
};

const TechnicalIndicators = ({ symbol }: TechnicalIndicatorsProps) => {
  const data = technicalData[symbol] || technicalData.AAPL;

  const getSignalColor = (signal: "buy" | "sell" | "neutral") => {
    switch (signal) {
      case "buy":
        return "text-success";
      case "sell":
        return "text-destructive";
      default:
        return "text-warning";
    }
  };

  const getSignalIcon = (signal: "buy" | "sell" | "neutral") => {
    switch (signal) {
      case "buy":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "sell":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-warning" />;
    }
  };

  const getMaStatus = (status: "above" | "below") => {
    return status === "above" ? (
      <span className="text-success">Above</span>
    ) : (
      <span className="text-destructive">Below</span>
    );
  };

  const rsiColor = data.rsi > 70 ? "text-destructive" : data.rsi < 30 ? "text-success" : "text-foreground";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Technical Indicators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* RSI and Key Levels */}
          <div className="space-y-4">
            {/* RSI */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">RSI (14)</span>
                <span className={`font-mono font-bold ${rsiColor}`}>{data.rsi}</span>
              </div>
              <div className="relative">
                <Progress value={data.rsi} className="h-2" />
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>Oversold (30)</span>
                  <span>Overbought (70)</span>
                </div>
              </div>
            </div>

            {/* Support & Resistance */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-success/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">Support</p>
                <p className="text-lg font-bold font-mono text-success">${data.support.toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-destructive/10 p-3 text-center">
                <p className="text-xs text-muted-foreground">Resistance</p>
                <p className="text-lg font-bold font-mono text-destructive">${data.resistance.toFixed(2)}</p>
              </div>
            </div>

            {/* Moving Averages */}
            <div>
              <h4 className="mb-2 text-sm font-medium">Moving Averages</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-secondary/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">MA 20</p>
                  <p className="text-sm font-medium">{getMaStatus(data.movingAverages.ma20)}</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">MA 50</p>
                  <p className="text-sm font-medium">{getMaStatus(data.movingAverages.ma50)}</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-2 text-center">
                  <p className="text-xs text-muted-foreground">MA 200</p>
                  <p className="text-sm font-medium">{getMaStatus(data.movingAverages.ma200)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Indicator Signals */}
          <div>
            <h4 className="mb-3 text-sm font-medium">Indicator Signals</h4>
            <div className="space-y-2">
              {data.indicators.map((indicator) => (
                <div 
                  key={indicator.name}
                  className="flex items-center justify-between rounded-md bg-secondary/30 px-3 py-2"
                >
                  <span className="text-sm">{indicator.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm">{indicator.value}</span>
                    <div className="flex items-center gap-1">
                      {getSignalIcon(indicator.signal)}
                      <span className={`text-xs font-medium uppercase ${getSignalColor(indicator.signal)}`}>
                        {indicator.signal}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
