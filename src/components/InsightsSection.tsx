"use client";

import { ArrowUpRight, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const insights = [
  {
    category: "Market Update",
    title: "Fed Signals Potential Rate Cuts in 2024",
    summary: "Federal Reserve hints at possible rate reductions, boosting tech and growth stocks. AI analysis suggests positive momentum for NASDAQ.",
    time: "2 hours ago",
    impact: "bullish",
  },
  {
    category: "Earnings",
    title: "NVIDIA Beats Q4 Expectations",
    summary: "NVIDIA reports record revenue driven by AI chip demand. Stock shows strong buy signals across all indicators.",
    time: "5 hours ago",
    impact: "bullish",
  },
  {
    category: "Analysis",
    title: "Electric Vehicle Sector Outlook",
    summary: "Mixed signals in EV market as competition intensifies. AI recommends selective positioning in established players.",
    time: "8 hours ago",
    impact: "neutral",
  },
];

const InsightsSection = () => {
  const impactStyles = {
    bullish: "bg-success/10 text-success border-success/20",
    bearish: "bg-destructive/10 text-destructive border-destructive/20",
    neutral: "bg-muted text-muted-foreground border-border",
  };

  return (
    <section id="insights" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Market Insights</h2>
            <p className="max-w-xl text-muted-foreground">
              AI-curated news and analysis that impacts your portfolio.
            </p>
          </div>
          <a href="#" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex">
            View all insights
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        
        <div className="grid gap-5 md:grid-cols-3">
          {insights.map((insight, index) => (
            <Card key={index} className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/20">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant="secondary" className="font-normal">
                    {insight.category}
                  </Badge>
                  <Badge variant="outline" className={impactStyles[insight.impact as keyof typeof impactStyles]}>
                    {insight.impact}
                  </Badge>
                </div>
                
                <h3 className="mb-3 text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                  {insight.title}
                </h3>
                
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                  {insight.summary}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {insight.time}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
