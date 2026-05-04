"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const StockSearch = () => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Simulate search - will be replaced with actual AI integration
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search any stock (e.g., AAPL, TSLA, GOOGL)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-14 rounded-xl border-border bg-card pl-12 pr-32 text-base shadow-sm transition-shadow focus:shadow-md"
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={isSearching}
          className="absolute right-2 h-10 px-5"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
    </form>
  );
};

export default StockSearch;
