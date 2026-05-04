"use client";

import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">StockSense AI</span>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">About</a>
            <a href="#" className="transition-colors hover:text-foreground">Features</a>
            <a href="#" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#" className="transition-colors hover:text-foreground">Blog</a>
            <a href="#" className="transition-colors hover:text-foreground">Contact</a>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © 2024 StockSense AI. All rights reserved.
          </p>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            Disclaimer: StockSense AI provides information for educational purposes only. 
            This is not financial advice. Always do your own research before making investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
