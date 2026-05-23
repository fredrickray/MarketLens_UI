"use client";

import { ArrowUpRight, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueries } from "@tanstack/react-query";
import { stocksApi } from "@/lib/api/endpoints";
import type { NewsArticle } from "@/lib/api/types";

const NEWS_SYMBOLS = ["AAPL", "NVDA", "MSFT"];

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const hours = Math.floor((Date.now() - then) / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const InsightsSection = () => {
  const results = useQueries({
    queries: NEWS_SYMBOLS.map((symbol) => ({
      queryKey: ["stocks", "news", symbol, { limit: 3 }],
      queryFn: () => stocksApi.news(symbol, { limit: 3 }),
      staleTime: 300_000,
    })),
  });

  const loading = results.some((r) => r.isLoading);
  const articles: NewsArticle[] = results
    .flatMap((r) => r.data?.articles ?? [])
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <section id="insights" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-4 text-3xl font-bold">Market Insights</h2>
            <p className="max-w-xl text-muted-foreground">
              The latest headlines moving the market&apos;s most-watched names.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {loading &&
            [0, 1, 2].map((i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}

          {!loading &&
            articles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <Badge variant="secondary" className="font-normal">
                        {article.source}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="mb-3 text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {article.headline}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeAgo(article.publishedAt)}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}

          {!loading && articles.length === 0 && (
            <p className="text-muted-foreground">No recent market news available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default InsightsSection;
