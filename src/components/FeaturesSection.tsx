"use client";

import { Brain, Newspaper, BarChart3, Bell, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI recommendations",
    description:
      "A trained model scores recent price and volume patterns, then maps them to buy, hold, or avoid with a confidence reading.",
  },
  {
    icon: Newspaper,
    title: "Company news",
    description:
      "See recent headlines for the stock you’re analyzing so you can pair the model’s signal with what’s happening in the market.",
  },
  {
    icon: BarChart3,
    title: "Technical drivers",
    description:
      "Explanations highlight the signals that mattered most — like RSI, trend, volatility, and volume — in plain language.",
  },
  {
    icon: Bell,
    title: "Smart alerts",
    description:
      "Get notified when a stock hits your price target or when the model’s recommendation changes.",
  },
  {
    icon: Shield,
    title: "Risk preferences",
    description:
      "Set your time horizon and risk tolerance so recommendations adjust to how you invest — not a one-size-fits-all call.",
  },
  {
    icon: Zap,
    title: "Fast stock lookup",
    description:
      "Search a ticker, pull a live overview, and get an analysis in seconds — with charts and news alongside.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Why Choose MarketLens AI?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Built for clearer, inspectable stock analysis — not black-box hype.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border transition-all hover:border-primary/20 hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
