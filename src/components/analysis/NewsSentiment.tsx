"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";

interface NewsSentimentProps {
  symbol: string;
}

const newsData: Record<string, {
  overallSentiment: "bullish" | "neutral" | "bearish";
  sentimentScore: number;
  articles: { title: string; source: string; sentiment: "positive" | "neutral" | "negative"; time: string }[];
}> = {
  AAPL: {
    overallSentiment: "bullish",
    sentimentScore: 72,
    articles: [
      { title: "Apple's AI Strategy Could Drive Next Growth Wave", source: "Bloomberg", sentiment: "positive", time: "2h ago" },
      { title: "iPhone 16 Sales Exceed Analyst Expectations", source: "Reuters", sentiment: "positive", time: "5h ago" },
      { title: "Apple Faces Regulatory Pressure in EU Markets", source: "WSJ", sentiment: "negative", time: "8h ago" },
      { title: "Services Revenue Hits All-Time High", source: "CNBC", sentiment: "positive", time: "1d ago" },
    ],
  },
  NVDA: {
    overallSentiment: "bullish",
    sentimentScore: 88,
    articles: [
      { title: "NVIDIA Blackwell Chips See Record Pre-Orders", source: "Reuters", sentiment: "positive", time: "1h ago" },
      { title: "Data Center Revenue Surges 150% YoY", source: "Bloomberg", sentiment: "positive", time: "4h ago" },
      { title: "AI Boom Shows No Signs of Slowing", source: "TechCrunch", sentiment: "positive", time: "6h ago" },
      { title: "Competition from AMD Intensifies", source: "WSJ", sentiment: "neutral", time: "12h ago" },
    ],
  },
  TSLA: {
    overallSentiment: "neutral",
    sentimentScore: 48,
    articles: [
      { title: "Tesla Robotaxi Event Leaves Analysts Divided", source: "CNBC", sentiment: "neutral", time: "3h ago" },
      { title: "EV Competition Heats Up in China", source: "Bloomberg", sentiment: "negative", time: "6h ago" },
      { title: "Energy Storage Business Shows Promise", source: "Reuters", sentiment: "positive", time: "10h ago" },
      { title: "Margin Pressure Concerns Persist", source: "WSJ", sentiment: "negative", time: "1d ago" },
    ],
  },
  MSFT: {
    overallSentiment: "bullish",
    sentimentScore: 78,
    articles: [
      { title: "Microsoft Copilot Adoption Accelerates", source: "Bloomberg", sentiment: "positive", time: "2h ago" },
      { title: "Azure Cloud Growth Beats Expectations", source: "Reuters", sentiment: "positive", time: "5h ago" },
      { title: "Gaming Division Reports Strong Quarter", source: "TechCrunch", sentiment: "positive", time: "8h ago" },
      { title: "Enterprise AI Spending to Benefit Microsoft", source: "WSJ", sentiment: "positive", time: "1d ago" },
    ],
  },
  META: {
    overallSentiment: "bullish",
    sentimentScore: 70,
    articles: [
      { title: "Meta AI Features Drive User Engagement", source: "CNBC", sentiment: "positive", time: "1h ago" },
      { title: "Reels Monetization Improving Rapidly", source: "Bloomberg", sentiment: "positive", time: "4h ago" },
      { title: "Reality Labs Losses Narrow", source: "Reuters", sentiment: "neutral", time: "7h ago" },
      { title: "Ad Revenue Recovery Stronger Than Expected", source: "WSJ", sentiment: "positive", time: "12h ago" },
    ],
  },
  GOOGL: {
    overallSentiment: "neutral",
    sentimentScore: 55,
    articles: [
      { title: "Google Search Faces AI Competition", source: "Bloomberg", sentiment: "negative", time: "2h ago" },
      { title: "YouTube Ad Revenue Continues Growth", source: "Reuters", sentiment: "positive", time: "5h ago" },
      { title: "Cloud Division Shows Mixed Results", source: "CNBC", sentiment: "neutral", time: "9h ago" },
      { title: "Regulatory Challenges Mount Globally", source: "WSJ", sentiment: "negative", time: "1d ago" },
    ],
  },
};

const NewsSentiment = ({ symbol }: NewsSentimentProps) => {
  const news = newsData[symbol] || newsData.AAPL;

  const getSentimentColor = (sentiment: "bullish" | "neutral" | "bearish") => {
    switch (sentiment) {
      case "bullish":
        return "text-success";
      case "bearish":
        return "text-destructive";
      default:
        return "text-warning";
    }
  };

  const getArticleSentimentIcon = (sentiment: "positive" | "neutral" | "negative") => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-3 w-3 text-success" />;
      case "negative":
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return <Minus className="h-3 w-3 text-warning" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          News Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Sentiment */}
        <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
          <div>
            <p className="text-sm text-muted-foreground">Overall</p>
            <p className={`text-lg font-bold capitalize ${getSentimentColor(news.overallSentiment)}`}>
              {news.overallSentiment}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-lg font-bold font-mono">{news.sentimentScore}/100</p>
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-3">
          {news.articles.map((article, index) => (
            <div 
              key={index}
              className="group cursor-pointer rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/30"
            >
              <div className="mb-1 flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h4>
                {getArticleSentimentIcon(article.sentiment)}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSentiment;
