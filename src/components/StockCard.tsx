"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface StockCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation?: "buy" | "hold" | "avoid";
}

const StockCard = ({ symbol, name, price, change, changePercent, recommendation }: StockCardProps) => {
  const isPositive = change >= 0;
  
  const recommendationStyles = {
    buy: "bg-success/10 text-success border-success/20",
    hold: "bg-warning/10 text-warning border-warning/20",
    avoid: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <Link href={`/stock/${symbol}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/20">
        <CardContent className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{symbol}</h3>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
            {recommendation && (
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${recommendationStyles[recommendation]}`}>
                {recommendation}
              </span>
            )}
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold font-mono">${price.toFixed(2)}</p>
              <div className={`mt-1 flex items-center gap-1 text-sm ${isPositive ? "text-success" : "text-destructive"}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-medium">
                  {isPositive ? "+" : ""}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            {/* Mini chart placeholder */}
            <div className="h-12 w-20">
              <svg viewBox="0 0 80 40" className={`h-full w-full ${isPositive ? "text-success" : "text-destructive"}`}>
                <path
                  d={isPositive 
                    ? "M0,35 Q20,30 30,25 T50,15 T80,5" 
                    : "M0,5 Q20,10 30,20 T50,30 T80,35"
                  }
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StockCard;
