"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useStockNews } from "@/hooks/api";

interface NewsSentimentProps {
  symbol: string;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const NewsSentiment = ({ symbol }: NewsSentimentProps) => {
  const { data, isLoading, isError } = useStockNews(symbol, { limit: 8 });
  const articles = data?.articles ?? [];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        )}

        {isError && (
          <p className="text-sm text-muted-foreground">News is unavailable right now.</p>
        )}

        {!isLoading && !isError && articles.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent news for {symbol}.</p>
        )}

        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/30"
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {article.headline}
              </h4>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{article.source}</span>
              <span>•</span>
              <span>{timeAgo(article.publishedAt)}</span>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewsSentiment;
