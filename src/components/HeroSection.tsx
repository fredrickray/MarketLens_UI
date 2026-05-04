"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import StockSearch from "./StockSearch";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">AI-Powered Stock Analysis</span>
          </div>
          
          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Make Smarter Investment
            <br />
            <span className="text-primary">Decisions with AI</span>
          </h1>
          
          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Analyze market trends, breaking news, and financial indicators instantly. 
            Get AI-powered recommendations to help you buy, hold, or sell with confidence.
          </p>
          
          {/* Search Component */}
          <div className="mx-auto mb-8 max-w-xl">
            <StockSearch />
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Start Analyzing
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              Real-time data
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              15,000+ stocks covered
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              85% accuracy rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
