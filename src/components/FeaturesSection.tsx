"use client";

import { Brain, Newspaper, BarChart3, Bell, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning models analyze thousands of data points to provide accurate stock predictions.",
  },
  {
    icon: Newspaper,
    title: "News Sentiment",
    description: "Real-time analysis of news articles, social media, and earnings calls to gauge market sentiment.",
  },
  {
    icon: BarChart3,
    title: "Technical Indicators",
    description: "Comprehensive technical analysis including RSI, MACD, Bollinger Bands, and custom indicators.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Get notified when stocks hit your price targets or when significant market events occur.",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Understand the risk profile of each investment with our volatility and drawdown analysis.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description: "Get AI-generated summaries and recommendations in seconds, not hours of research.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Why Choose MarketLens AI?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Leverage cutting-edge AI technology to make informed investment decisions with confidence.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="group border-border transition-all hover:border-primary/20 hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
