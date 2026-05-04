"use client";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TrendingSection from "@/components/TrendingSection";
import InsightsSection from "@/components/InsightsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TrendingSection />
        <InsightsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
